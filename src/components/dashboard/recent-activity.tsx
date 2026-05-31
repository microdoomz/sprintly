"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  createdAt: Date;
  user: {
    name: string;
    image: string | null;
  };
  board: {
    title: string;
  };
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  const [open, setOpen] = useState(false);
  const recentActivities = activities.slice(0, 5);

  return (
    <Card className="lg:col-span-3 flex flex-col w-full min-w-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Updates from your shared boards
          </CardDescription>
        </div>
        {activities.length > 5 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">View All</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>All Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 text-sm">
                    <div className="mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {activity.user.name || "Someone"} {activity.action} a {activity.entityType}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        in {activity.board.title}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(activity.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
            <Activity className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Activities will appear as actions are taken.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 text-sm">
                <div className="mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {activity.user.name || "Someone"} {activity.action} a {activity.entityType}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    in {activity.board.title}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTimeAgo(activity.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
