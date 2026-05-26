"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Shield, User } from "lucide-react";
import { addBoardMember } from "@/actions/board-actions";
import { Badge } from "@/components/ui/badge";

interface ShareBoardDialogProps {
  board: {
    id: string;
    title: string;
    members: any[];
  };
}

export function ShareBoardDialog({ board }: ShareBoardDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setIsLoading(true);
      const res = await addBoardMember(board.id, email.trim());
      
      if (res.error) {
        throw new Error(res.error);
      }

      toast.success(`Successfully added "${email}" to the board!`);
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden sm:flex cursor-pointer">
          <UserPlus className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Board</DialogTitle>
          <DialogDescription>
            Invite other users to collaborate on &quot;{board.title}&quot;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email">Invite by Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="collaborator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="h-9"
              />
              <Button type="submit" size="sm" className="h-9 cursor-pointer" disabled={isLoading}>
                Add
              </Button>
            </div>
          </div>
        </form>

        <div className="border-t pt-4 space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Current Members ({board.members.length})
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {board.members.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={member.user.image || ""} />
                    <AvatarFallback className="text-[10px] bg-primary/20 text-primary">
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium truncate leading-tight">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate leading-tight">{member.user.email}</p>
                  </div>
                </div>
                <Badge variant={member.role === "owner" ? "default" : "secondary"} className="text-[10px] capitalize px-1.5 py-0">
                  {member.role === "owner" ? (
                    <Shield className="h-3 w-3 mr-1 inline" />
                  ) : (
                    <User className="h-3 w-3 mr-1 inline" />
                  )}
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
