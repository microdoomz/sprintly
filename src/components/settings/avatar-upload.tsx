"use client";

import { useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateAvatar, updateProfile } from "@/actions/settings-actions";
import { updateUser } from "@/lib/auth/auth-client";

interface AvatarUploadProps {
  currentImage: string | null;
  currentName: string;
  userEmail: string;
}

export function AvatarUpload({ currentImage, currentName, userEmail }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    startTransition(async () => {
      const result = await updateAvatar(formData);
      
      if (result.error) {
        setIsUploading(false);
        toast.error(result.error);
        setPreview(currentImage); // Revert preview
      } else {
        // Force the client-side session to update its cached avatar
        await updateUser({ image: result.imageUrl });
        setIsUploading(false);
        toast.success("Avatar updated successfully!");
      }
    });
  };

  const handleSaveProfile = () => {
    if (name === currentName) return;
    startTransition(async () => {
      const result = await updateProfile(name);
      if (result.error) {
        toast.error(result.error);
      } else {
        await updateUser({ name: name });
        toast.success("Profile updated!");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Avatar className="h-20 w-20">
            <AvatarImage src={preview || ""} />
            <AvatarFallback className="text-2xl bg-primary/20 text-primary">
              {currentName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleFileSelect}
            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <Button variant="outline" onClick={handleFileSelect} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Change Avatar"
          )}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" defaultValue={userEmail} disabled />
          <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
        </div>
      </div>

      <Button onClick={handleSaveProfile} disabled={isPending || name === currentName}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}
