"use client";
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  CallEnd,
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
} from '@mui/icons-material';

interface IncomingCall {
  from: string;
  offer: RTCSessionDescriptionInit;
}

const VideoCallApp = () => {
  const [socketId, setSocketId] = useState<string>('');
  const [remoteSocketId, setRemoteSocketId] = useState<string>('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callStatus, setCallStatus] = useState<
    'disconnected' | 'connecting' | 'ringing' | 'in-call'
  >('disconnected');
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socket = useRef<Socket | null>(null);
  const callTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();

    socket.current = io(process.env.NEXT_PUBLIC_SOCKET_SERVER || 'http://localhost:3001', {
      reconnectionAttempts: 5,
      transports: ['websocket'],
    });

    socket.current.on('connect', () => {
      setSocketId(socket.current?.id || '');
    });

    socket.current.on('incoming-call', ({ from, offer }: IncomingCall) => {
      setIncomingCall({ from, offer });
      setCallStatus('ringing');
    });

    socket.current.on('call-accepted', async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection?.current?.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.current.on('ice-candidate', (candidate: RTCIceCandidate) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.current?.disconnect();
      localStream?.getTracks().forEach((track) => track.stop());
      if (callTimer.current) clearInterval(callTimer.current);
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && remoteSocketId) {
        socket.current?.emit('ice-candidate', {
          to: remoteSocketId,
          candidate: candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const startCall = async () => {
    if (!localStream) return;

    setCallStatus('connecting');
    peerConnection.current = createPeerConnection();

    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.current?.emit('call-user', {
        to: remoteSocketId,
        offer,
      });

      startCallTimer();
      setCallStatus('in-call');
    } catch (error) {
      console.error('Error starting call:', error);
      endCall();
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !localStream) return;

    peerConnection.current = createPeerConnection();
    localStream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, localStream);
    });

    try {
      await peerConnection?.current?.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current?.emit('answer-call', {
        to: incomingCall.from,
        answer,
      });

      setCallStatus('in-call');
      setIncomingCall(null);
      startCallTimer();
    } catch (error) {
      console.error('Error accepting call:', error);
      endCall();
    }
  };

  const rejectCall = () => {
    socket.current?.emit('call-rejected', { to: incomingCall?.from });
    setIncomingCall(null);
    setCallStatus('disconnected');
  };

  const toggleAudio = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsVideoOn(!isVideoOn);
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = peerConnection.current
          ?.getSenders()
          .find((s) => s.track?.kind === 'video');

        if (sender && screenTrack) {
          await sender.replaceTrack(screenTrack);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          screenTrack.onended = () => toggleScreenShare();
        }
      } else {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const cameraTrack = cameraStream.getVideoTracks()[0];

        const sender = peerConnection.current
          ?.getSenders()
          .find((s) => s.track?.kind === 'video');

        if (sender && cameraTrack) {
          await sender.replaceTrack(cameraTrack);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = cameraStream;
          }
        }
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const endCall = () => {
    peerConnection.current?.close();
    setCallStatus('disconnected');
    setRemoteStream(null);
    if (callTimer.current) clearInterval(callTimer.current);
    setCallDuration(0);
  };

  const startCallTimer = () => {
    const startTime = Date.now();
    callTimer.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', p: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="primary">
          VideoMeet
        </Typography>
        <Typography variant="subtitle1">Your ID: {socketId}</Typography>
        {callStatus === 'in-call' && (
          <Typography variant="subtitle2">
            Call duration: {formatDuration(callDuration)}
          </Typography>
        )}
      </Box>

      <Grid container spacing={2} sx={{ height: '70vh' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ height: '100%', position: 'relative' }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
              <Typography variant="caption" color="white">
                You ({socketId})
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={6}
            sx={{
              height: '100%',
              position: 'relative',
              bgcolor: 'grey.900',
            }}
          >
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {callStatus === 'connecting'
                    ? 'Connecting...'
                    : 'Waiting for participant'}
                </Typography>
              </Box>
            )}
            {remoteStream && (
              <Box sx={{ position: 'absolute', bottom: 8, left: 8 }}>
                <Typography variant="caption" color="white">
                  Participant ({remoteSocketId})
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          py: 2,
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {callStatus === 'disconnected' ? (
            <>
              <TextField
                label="Enter Participant ID"
                variant="outlined"
                size="small"
                value={remoteSocketId}
                onChange={(e) => setRemoteSocketId(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={startCall}
                disabled={!remoteSocketId}
              >
                Start Call
              </Button>
            </>
          ) : (
            <>
              <IconButton
                color={isMuted ? 'error' : 'primary'}
                onClick={toggleAudio}
              >
                {isMuted ? <MicOff /> : <Mic />}
              </IconButton>

              <IconButton
                color={isVideoOn ? 'primary' : 'error'}
                onClick={toggleVideo}
              >
                {isVideoOn ? <Videocam /> : <VideocamOff />}
              </IconButton>

              <IconButton
                color={isScreenSharing ? 'primary' : 'default'}
                onClick={toggleScreenShare}
              >
                {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
              </IconButton>

              <IconButton color="error" onClick={endCall}>
                <CallEnd />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {incomingCall && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Incoming Call from {incomingCall.from}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="success"
                onClick={acceptCall}
                size="large"
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={rejectCall}
                size="large"
              >
                Decline
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default VideoCallApp;