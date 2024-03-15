import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(weeks / 4.35);
  const years = Math.round(months / 12);

  if (seconds < 60) return `${seconds} seconds ago`;
  else if (minutes < 60) return `${minutes} minutes ago`;
  else if (hours < 24) return `${hours} hours ago`;
  else if (days < 7) return `${days} days ago`;
  else if (weeks < 4.35) return `${weeks} weeks ago`;
  else if (months < 12) return `${months} months ago`;
  else return `${years} years ago`;
}

export function checkIsLiked(likes: string[], userId: string): boolean {
  return likes.includes(userId);
}