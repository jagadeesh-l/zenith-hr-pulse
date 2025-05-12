
import { cn } from "@/lib/utils";

type FeedCardProps = {
  author: string;
  timestamp: string;
  content: string;
  likes?: number;
  comments?: number;
  authorPhoto?: string;
  className?: string;
}

export function FeedCard({ 
  author, 
  timestamp, 
  content, 
  likes = 0, 
  comments = 0, 
  authorPhoto, 
  className 
}: FeedCardProps) {
  return (
    <div className={cn("bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border mb-4 animate-fade-in", className)}>
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {authorPhoto ? (
            <img src={authorPhoto} alt={author} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-hr-primary flex items-center justify-center text-white font-bold">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm">{author}</h3>
          <p className="text-xs text-muted-foreground">{timestamp}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm">{content}</p>
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground">
        <button className="flex items-center mr-4 hover:text-primary transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          {likes}
        </button>
        <button className="flex items-center hover:text-primary transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
          </svg>
          {comments}
        </button>
      </div>
    </div>
  );
}
