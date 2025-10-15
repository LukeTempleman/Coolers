"use client";

import React, { useState } from 'react';
import { useGetMessagesQuery, useSendMessageMutation } from '../../state/api';
import { MessageCircle, Search, Send, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { format } from 'date-fns';
import { Input } from '../../../components/ui/input';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Skeleton } from '../../../components/ui/skeleton';
import { Textarea } from '../../../components/ui/textarea';
import { useParams, useRouter } from 'next/navigation';
import { useGetMessageQuery, useMarkMessageReadMutation } from '../../state/api';

export default function MessagesPage() {
  const router = useRouter();
  const params = useParams();
  const selectedMessageId = params?.id as string;
  
  const { data: messages, isLoading: messagesLoading } = useGetMessagesQuery({ limit: 100 });
  const { data: selectedMessage, isLoading: messageLoading } = useGetMessageQuery(
    selectedMessageId, 
    { skip: !selectedMessageId }
  );
  const [markAsRead] = useMarkMessageReadMutation();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessageContent, setNewMessageContent] = useState('');
  
  const filteredMessages = messages?.filter(message => 
    message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSelectMessage = async (message: Message) => {
    if (!message.read) {
      await markAsRead(message.id);
    }
    router.push(`/users/messages/${message.id}`);
  };
  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !selectedMessageId || !selectedMessage) return;
    
    await sendMessage({
      recipientId: selectedMessage.sender.id,
      content: newMessageContent,
      threadId: selectedMessage.threadId
    });
    
    setNewMessageContent('');
  };
  
  return (
    <div className="container mx-auto py-6 h-[calc(100vh-100px)]">
      <div className="flex h-full rounded-lg overflow-hidden border">
        {/* Messages List Sidebar */}
        <div className="w-1/3 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            {messagesLoading ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex gap-3 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMessages?.length === 0 ? (
              <div className="text-center py-10">
                <MessageCircle className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No messages</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don&apos;t have any messages yet.
                </p>
              </div>
            ) : (
              <div>
                {filteredMessages?.map(message => (
                  <div 
                    key={message.id}
                    className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 
                      ${message.id === selectedMessageId ? 'bg-blue-50' : ''} 
                      ${!message.read && message.id !== selectedMessageId ? 'bg-gray-50' : ''}`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {message.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <p className={`font-medium ${!message.read ? 'text-black' : 'text-gray-700'}`}>
                            {message.sender.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(message.timestamp), 'MMM d')}
                          </p>
                        </div>
                        <p className={`text-sm truncate ${!message.read ? 'font-medium text-black' : 'text-gray-500'}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        
        {/* Message Conversation */}
        <div className="w-2/3 bg-gray-50 flex flex-col">
          {!selectedMessageId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No message selected</h3>
                <p className="mt-1 text-gray-500">
                  Select a conversation from the sidebar to view messages
                </p>
              </div>
            </div>
          ) : messageLoading ? (
            <div className="flex-1 p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-4 mt-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'justify-end' : ''}`}>
                    {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                    <Skeleton className={`h-24 ${i % 2 === 0 ? 'w-2/3' : 'w-1/2'} rounded-lg`} />
                    {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="border-b bg-white p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedMessage?.sender?.name?.charAt(0) || <User />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">{selectedMessage?.sender?.name}</h2>
                    <p className="text-xs text-gray-500">
                      {selectedMessage?.sender?.role || 'User'}
                    </p>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedMessage?.thread?.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex gap-3 ${msg.isFromMe ? 'justify-end' : ''}`}
                    >
                      {!msg.isFromMe && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            {selectedMessage.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`p-3 rounded-lg max-w-[70%] ${
                          msg.isFromMe 
                            ? 'bg-primary-700 text-white' 
                            : 'bg-white border'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.isFromMe ? 'text-primary-200' : 'text-gray-500'}`}>
                          {format(new Date(msg.timestamp), 'h:mm a')}
                        </p>
                      </div>
                      {msg.isFromMe && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            Me
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Type your message..."
                    className="resize-none"
                    value={newMessageContent}
                    onChange={(e) => setNewMessageContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    className="self-end"
                    onClick={handleSendMessage}
                    disabled={!newMessageContent.trim() || isSending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}