import { User } from 'next-auth';
import React, { FC } from 'react'
import { Avatar, AvatarFallback } from './ui/Avatar';
import Image from 'next/image'
import { Icons } from './Icons';
import { AvatarProps } from '@radix-ui/react-avatar';

interface UserAvatarProps extends AvatarProps {
  // Pick is a typescript utility that allows you to select certain properties from a type and create a new type from them
  user: Pick<User, "name" | "image">;
}


export const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className='relative aspect-square h-full w-full'>
          {/* NextJS image component optimized to render images */}
          {/* user.image is the profile picture provided by google */}
          <Image fill src={user.image} alt="profile picture" referrerPolicy='no-referrer' />
        </div>
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{user?.name}</span> {/* sr-only is a tailwind class that hides the text from the screen readers */}
          <Icons.user className='w-4 h-4' />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

