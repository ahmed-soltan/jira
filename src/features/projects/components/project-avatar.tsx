import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?:string
}
export const ProjectAvatar = ({
  image,
  name,
  className,
  fallbackClassName
}: ProjectAvatarProps) => {
  if (image) {
    return (
      <div
        className={cn("size-10 rounded-md overflow-hidden relative", className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback className={cn("text-white bg-blue-600 semibold uppercase text-sm rounded-md" , fallbackClassName)}>
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};
