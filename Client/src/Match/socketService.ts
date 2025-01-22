import { io, Socket } from "socket.io-client";
import { LiveMatchDataInitial, LiveMatchDataUpdate } from "./LiveMatches/Hooks/useRoomDataManagement";
import { CreateLiveMatchProps } from "./MatchManagement/Hooks/useCreateLiveMatchFromData";

export interface TeamProps {
  _id: string;
  name: string;
  logo: string;
}

export interface InitialData {
  scoreUpdater?: string;
  team1: TeamProps;
  team2: TeamProps;
  gender: string;
  sport: string;
  tag?: string;
  venue?: string;
  scheduledAt?: string;
}

export interface UpdateScoreData {
  team: "TEAM1" | "TEAM2";
  score: string;
  scoreUpdater?: string;
  roomId?: string;
}

interface EventMap {
  joinParticularRoom: string;
  updateScore: UpdateScoreData;
  roomDNE: string;
  roomJoinSuccess: LiveMatchDataInitial;
  errorJoiningRoom: string;
  errorUpdatingScore: string;
  updateLiveScore: LiveMatchDataUpdate;
  scoreUpdated: string;
  leaveParticularRoom: string;
  roomClosing: string;
  roomCreationSuccess: string;
  errorCreatingRoom: string;
  createLiveMatchFromUpcomingMatch: {
    userId: string;
    matchId: string;
  };
  createLiveMatchFromEnteredData: CreateLiveMatchProps;
  closeParticularRoom: {
    roomId: string;
    winnerTeam: "TEAM1" | "TEAM2" | "TIE";
    scoreUpdater: string;
  };
  errorClosingRoom: string;
  roomClosed: string;
}

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  // Get the instance of the service (singleton)
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Initialize socket connection
  public connect(): void {
    const serverUrl = import.meta.env.VITE_API_URL_WEB_SOCKETS;
    if (!this.socket) {
      this.socket = io(serverUrl, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
      });

      this.socket.on("connect", () => {});

      this.socket.on("disconnect", () => {
        console.log("Disconnected from server");
        this.socket = null;
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      this.socket.on("reconnect_error", (error) => {
        console.error("Reconnection error:", error);
      });
    }
  }

  // Emit event to the server
  public emit<T extends keyof EventMap>(event: T, data?: EventMap[T]): void {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.error("Socket is not connected");
    }
  }

  // Listen to an event from the server with a broader callback signature
  public on<T extends keyof EventMap>(event: T, callback: (data: EventMap[T]) => void): void {
    if (this.socket) {
      this.socket.on(event as string, callback as (...args: any[]) => void);
    }
  }

  // Listen to an event only once from the server with a broader callback signature
  public once<T extends keyof EventMap>(event: T, callback: (data: EventMap[T]) => void): void {
    if (this.socket) {
      this.socket.once(event as string, callback as (...args: any[]) => void);
    }
  }

  // Remove event listener with a broader callback signature
  public off<T extends keyof EventMap>(event: T, callback: (data: EventMap[T]) => void): void {
    if (this.socket) {
      this.socket.off(event as string, callback as (...args: any[]) => void);
    }
  }

  // Get the current socket ID
  public getSocketId(): string | undefined | null {
    return this.socket ? this.socket.id : null;
  }

  // Disconnect the socket
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
export default SocketService;
