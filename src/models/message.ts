import { ConversationModel, ConversationDTO } from "./conversation";
import { MemberModel, MemberDTO } from "./member";

export const MessageType = {
  Text: 'text',
  Image: 'image',
  Video: 'video',
  System: 'system'
}

export interface MessageDTO {
  _id: string;
  message: string;
  created_date: Date;
  updated_date?: Date;
  status?: number;
  message_type: string;
  sender: MemberDTO;
  conversation?: ConversationDTO | null;
}

export class MessageModel {
  id: string;
  message: string;
  createdDate: Date;
  updatedDate?: Date;
  status?: number;
  messageType: string;
  sender: MemberModel;
  conversation?: ConversationModel | null;

  constructor(
    id: string,
    message: string,
    createdDate: Date,
    updatedDate: Date | undefined,
    status: number | undefined,
    messageType: string,
    sender: MemberModel,
    conversation: ConversationModel | null
  ) {
    this.id = id;
    this.message = message;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
    this.status = status;
    this.messageType = messageType;
    this.sender = sender;
    this.conversation = conversation;
  }

  static fromDTO(dto: MessageDTO): MessageModel {
    return new MessageModel(
      dto._id,
      dto.message,
      new Date(dto.created_date), 
      dto.updated_date ? new Date(dto.updated_date) : undefined,
      dto.status,
      dto.message_type,
      MemberModel.fromDTO(dto.sender), 
      dto.conversation ? ConversationModel.fromDTO(dto.conversation) : null
    );
  }

  mapToDTO(): MessageDTO {
    return {
      _id: this.id,
      message: this.message,
      created_date: this.createdDate,
      updated_date: this.updatedDate,
      status: this.status,
      message_type: this.messageType,
      sender: this.sender.mapToDTO(),
      conversation: this.conversation ? this.conversation.mapToDTO() : null,
    };
  }
}
