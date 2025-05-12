
import { cn } from "@/lib/utils";

type EventType = "birthday" | "anniversary" | "event";

type UpcomingEventProps = {
  name: string;
  date: string;
  type: EventType;
  details?: string;
}

type UpcomingCardProps = {
  title: string;
  events: UpcomingEventProps[];
  className?: string;
}

const EventIcon = ({ type }: { type: EventType }) => {
  switch (type) {
    case "birthday":
      return (
        <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
          <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"></path>
          </svg>
        </div>
      );
    case "anniversary":
      return (
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
    case "event":
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      );
  }
};

export function UpcomingCard({ title, events, className }: UpcomingCardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border", className)}>
      <h3 className="font-medium mb-3">{title}</h3>
      
      <div className="space-y-3">
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        )}
        
        {events.map((event, index) => (
          <div key={index} className="flex items-center">
            <EventIcon type={event.type} />
            <div className="ml-3">
              <p className="text-sm font-medium">{event.name}</p>
              <p className="text-xs text-muted-foreground">{event.date}</p>
              {event.details && <p className="text-xs mt-1">{event.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
