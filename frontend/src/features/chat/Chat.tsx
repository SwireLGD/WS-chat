import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../users/usersSlice";
import { Message } from "../../types";
import { useNavigate } from "react-router-dom";
import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";

const Chat = () => {
    const user = useAppSelector(selectUser);
    const [messages, setMessages] = useState<Message[]>([]);
    const [participants, setParticipants] = useState<[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            ws.current = new WebSocket('ws://localhost:8000/chat');
            ws.current.onopen = () => {
                console.log('WebSocket connected');
                ws.current?.send(JSON.stringify({ type: 'LOGIN', payload: user }));
            };
            ws.current.onmessage = (event) => {
                console.log('Received message:', event.data);
                const message = JSON.parse(event.data);
                if (message.type === 'INITIAL_MESSAGES') {
                    setMessages(message.payload);
                } else if (message.type === 'NEW_MESSAGE') {
                    setMessages((prevMessages) => [...prevMessages, message.payload]);
                } else if (message.type === 'PARTICIPANTS_UPDATE') {
                    setParticipants(message.payload);
                }
            };
            ws.current.onclose = () => {
                console.log("WebSocket closed");
                ws.current = null;
            };
            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            return () => {
                ws.current?.close();
            };
        } else {
            navigate('/login');
            return;
        }
    }, [user, navigate]);
    

    const sendMessage = () => {
        console.log('Sending message:', newMessage);
        if (ws.current && ws.current.readyState === WebSocket.OPEN && newMessage.trim()) {
            ws.current.send(JSON.stringify({
                type: 'SEND_MESSAGE',
                payload: {
                    username: user?.username,
                    content: newMessage
                }
            }));
            setNewMessage('');
        } else {
            console.error('ws connection isn\'t open or new message is empty.');
        }
    };
    

    return (
        <Box sx={{ display: 'flex', minHeight: '90vh' }}>
            <Box sx={{ width: '30%', overflowY: 'auto', p: 2, bgcolor: '#f0f0f0' }}>
                <Typography variant="h6" gutterBottom>
                    Participants:
                </Typography>
                <List>
                    {participants.map((participant, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={participant} />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ width: '65%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Messages:
                    </Typography>
                    <List>
                        {messages.map((message, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`${message.username}: ${message.content}`} secondary={new Date(message.timestamp).toLocaleString()} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ display: 'flex', p: 2 }}>
                    <TextField
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <Button onClick={sendMessage} variant="contained" sx={{ ml: 2 }}>
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Chat;