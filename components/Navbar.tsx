"use client";
import React, { useState } from 'react'
import { NAVBAR_HEIGHT } from '../app/lib/constants'
import Link from 'next/link'
import { Button } from './ui/button'
import { 
  useGetAuthUserQuery, 
  useGetNotificationsQuery, 
  useGetMessagesQuery, 
  useMarkNotificationReadMutation,
  useMarkMessageReadMutation
} from '../app/state/api'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, MessageCircle, Settings } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback} from './ui/avatar'
import { signOut } from 'next-auth/react'
import { ScrollArea } from './ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { SidebarTrigger } from './ui/sidebar';

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  
  // Fetch notifications and messages (only when user is authenticated)
  const { data: notifications = [], isLoading: notificationsLoading } = useGetNotificationsQuery(
    { limit: 5 },
    { skip: !authUser }
  );
  
  const { data: messages = [], isLoading: messagesLoading } = useGetMessagesQuery(
    { limit: 5 },
    { skip: !authUser }
  );
  
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markMessageRead] = useMarkMessageReadMutation();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  
  const isDashboardPage = pathname.includes('/admins') || pathname.includes('/users');
  
  // Count unread notifications and messages
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  const handleSignOut = async () => {
    sessionStorage.removeItem('token');
    await signOut({ callbackUrl: '/' });
  };
  
  // Handle notification click
  const handleNotificationClick = async (notification: NotificationItem) => {
    setNotificationsOpen(false);
    
    // Mark as read if not already read
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }
    
    // Navigate based on notification type
    switch(notification.type) {
      case 'COOLER_ALERT':
        router.push(`/${authUser?.userRole?.toLowerCase() || 'users'}s/coolers/${notification.coolerId}`);
        break;
      case 'NEW_MESSAGE':
        router.push(`/${authUser?.userRole?.toLowerCase() || 'users'}s/messages`);
        break;
      default:
        router.push(`/${authUser?.userRole?.toLowerCase() || 'users'}s/notifications`);
    }
  };
  
  // Handle message click
  const handleMessageClick = async (message: Message) => {
    setMessagesOpen(false);
    
    // Mark as read if not already read
    if (!message.read) {
      await markMessageRead(message.id);
    }
    
    router.push(`/${authUser?.userRole?.toLowerCase() || 'users'}s/messages/${message.id}`);
  };
  
  // View all notifications
  const viewAllNotifications = () => {
    setNotificationsOpen(false);
    router.push(`/${authUser?.userRole?.toLowerCase() || 'users'}s/notifications`);
  };
  
  // View all messages
  const viewAllMessages = () => {
    setMessagesOpen(false);
    router.push(`/${authUser?.userRole?.toLowerCase() || 'users'}s/messages`);
  };
  
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4" style={{ height: `${NAVBAR_HEIGHT}px`}}>
      <div className="backdrop-blur-md bg-white/90 border border-gray-200/50 text-gray-800 shadow-lg rounded-full px-8 py-3 mx-auto w-full max-w-4xl flex justify-between items-center">
        <div className='flex items-center gap-4 md:gap-6'>
          {isDashboardPage && (
              <div className='md:hidden'>
                  <SidebarTrigger />
                  </div>
          )}
          <Link 
  href={
    authUser
      ? (authUser.userRole?.toLowerCase() === "admin"
          ? "/admins/coolers"
          : "/users/dashboard")
      : "/"
  }
  className="cursor-pointer hover:!text-blue-600 transition-colors"
  scroll={false}
  onClick={e => {
    if (!authUser) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Optionally update the URL to "/" if not already there
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }}
>
  <div className='flex items-center gap-3'>
    <div className="text-2xl font-bold">
      GO
      <span className="text-blue-600 font-semi-bold">
        NXT
      </span>
    </div>
  </div>
</Link>
        </div>

{/* Navigation Items - Only show on landing page */}
{!isDashboardPage && !authUser && (
  <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center space-x-8">
    <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
      Features
    </Link>
    <Link href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
      Benefits
    </Link>
    <Link href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
      How It Works
    </Link>
    <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
      Pricing
    </Link>
    <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
      Contact
    </Link>
  </nav>
)}
         
        <div className='flex items-center'>
          <div className='flex items-center gap-4'>
            {authUser ? (
              <>
                {/* Messages Dropdown */}
                <div className='relative hidden md:block'>
                  <DropdownMenu open={messagesOpen} onOpenChange={setMessagesOpen}>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer">
                        <MessageCircle className='w-6 h-6 text-gray-600 hover:text-blue-600'/>
                        {unreadMessages > 0 && (
                          <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs'>
                            {unreadMessages}
                          </span>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 bg-white" align="end">
                      <div className="flex items-center justify-between p-3 border-b">
                        <h3 className="font-semibold text-primary-700">Messages</h3>
                        {messages.length > 0 && (
                          <Button 
                            variant="ghost" 
                            className="text-xs text-primary-500 p-0 h-auto"
                            onClick={viewAllMessages}
                          >
                            View All
                          </Button>
                        )}
                      </div>
                      
                      <ScrollArea className="max-h-72">
                        {messagesLoading ? (
                          <div className="p-4 text-center text-gray-500">Loading messages...</div>
                        ) : messages.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No messages</div>
                        ) : (
                          messages.map(message => (
                            <DropdownMenuItem 
                              key={message.id}
                              className={`cursor-pointer p-3 border-b hover:bg-primary-50 ${!message.read ? 'bg-blue-50' : ''}`}
                              onClick={() => handleMessageClick(message)}
                            >
                              <div className="flex gap-3 w-full">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary-200 text-primary-700">
                                    {message.sender.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                  <div className="flex justify-between">
                                    <p className="font-medium text-sm text-gray-800">{message.sender.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <p className="text-sm truncate text-gray-600">
                                    {message.content}
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Notifications Dropdown */}
                <div className='relative hidden md:block'>
                  <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <DropdownMenuTrigger asChild>
                      <div className="relative cursor-pointer">
                        <Bell className='w-6 h-6 text-gray-600 hover:text-blue-600'/>
                        {unreadNotifications > 0 && (
                          <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs'>
                            {unreadNotifications}
                          </span>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 bg-white" align="end">
                      <div className="flex items-center justify-between p-3 border-b">
                        <h3 className="font-semibold text-primary-700">Notifications</h3>
                        {notifications.length > 0 && (
                          <Button 
                            variant="ghost" 
                            className="text-xs text-primary-500 p-0 h-auto"
                            onClick={viewAllNotifications}
                          >
                            View All
                          </Button>
                        )}
                      </div>
                      
                      <ScrollArea className="max-h-72">
                        {notificationsLoading ? (
                          <div className="p-4 text-center text-gray-500">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                          notifications.map(notification => (
                            <DropdownMenuItem 
                              key={notification.id}
                              className={`cursor-pointer p-3 border-b hover:bg-primary-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex gap-3 w-full">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  notification.priority === 'high' ? 'bg-red-100' : 'bg-blue-100'
                                }`}>
                                  <Bell className="h-4 w-4 text-primary-700" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                                    <p className="text-xs text-gray-500">
                                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {notification.message}
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* User dropdown - keep your existing code */}
                <DropdownMenu>
                  <DropdownMenuTrigger className='flex items-center gap-2 focus:outline-none'>
                    <Avatar>
                      <AvatarFallback className='bg-primary-600'>
                        {authUser.userRole?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className='text-gray-700 hidden md:block'>
                      {authUser.userInfo?.name}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='bg-white text-primary-700'>
                    <DropdownMenuItem className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
                      onClick={() =>
                        router.push(
                          authUser.userRole?.toLowerCase() === "admin" 
                            ? "/admins/coolers"
                            : "/users/dashboard",
                          { scroll: false }
                        )
                      }
                    >
                      Go to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className='bg-primary-200' />
                    
                    {/* Add these menu items */}
                    <DropdownMenuItem
  className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
  onClick={() =>
    router.push(`/${authUser.userRole?.toLowerCase()}s/messages`, { scroll: false })
  }
>
  <MessageCircle className="w-4 h-4 mr-2 text-primary-400" />
  Messages
  {unreadMessages > 0 && (
    <span className='ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full'>
      {unreadMessages}
    </span>
  )}
</DropdownMenuItem>

<DropdownMenuItem
  className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
  onClick={() =>
    router.push(`/${authUser.userRole?.toLowerCase()}s/notifications`, { scroll: false })
  }
>
  <Bell className="w-4 h-4 mr-2 text-primary-400" />
  Notifications
  {unreadNotifications > 0 && (
    <span className='ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full'>
      {unreadNotifications}
    </span>
  )}
</DropdownMenuItem>

<DropdownMenuItem
  className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
  onClick={() =>
    router.push(`/${authUser.userRole?.toLowerCase()}s/settings`, { scroll: false })
  }
>
  <Settings className="w-4 h-4 mr-2 text-primary-400" />
  Settings
</DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer hover:!bg-primary-700 hover:!text-primary-100'
                      onClick={handleSignOut}
                    >
                    <LogOut className="w-4 h-4 mr-2 text-primary-400" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/signin">
                <Button 
                  variant="outline"
                  className="text-gray-800 border-gray-300 bg-white/80 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full px-6 backdrop-blur-sm transition-all duration-300"
                >
                  Login
                </Button>
              </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;
