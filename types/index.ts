export type Show = {
  band: string;
  time: string;
  location: string;
};

export type TimeGroup = {
  startTime: string;
  endTime: string;
  shows: Show[];
}; 