import { MemberDTO, MemberModel } from "./member";
import { MessageModel, MessageDTO } from "./message";

export const ConversationType = {
  Private: 0,
  Group: 1
}

export interface ConversationDTO {
  _id: string;
  conversation_name: string | null;
  conversation_type: number;
  image?: string | null;
  created_date: Date;
  members?: MemberDTO[];
  messages?: MessageDTO[];
}

export class ConversationModel {
  id: string;
  conversationName: string;
  conversationType: number;
  image: string;
  createdDate: Date;
  members: MemberModel[];
  messages: MessageModel[];

  constructor(id: string, conversationName: string, conversationType: number,
    image: string,
    createdDate: Date,
    members: MemberModel[],
    messages: MessageModel[]) {
    this.id = id; 
    this.conversationName = conversationName;
    this.conversationType = conversationType;
    this.image = image;
    this.createdDate = createdDate;
    this.members = members;
    this.messages = messages; 
  }

  static fromDTO(dto: ConversationDTO): ConversationModel {
    return new ConversationModel(
      dto._id,
      dto.conversation_name ?? "",
      dto.conversation_type,
      dto.image ?? "",
      dto.created_date, 
      (dto.members ?? []).map((memberDTO) => MemberModel.fromDTO(memberDTO)), 
      (dto.messages ?? []).map((messageDTO) => MessageModel.fromDTO(messageDTO)) 
    );
  }

  mapToDTO(): ConversationDTO {
    return {
      _id: this.id,
      conversation_name: this.conversationName,
      conversation_type: this.conversationType,
      image: this.image || null,
      created_date: this.createdDate,
      members: this.members.map((memberModel) => memberModel.mapToDTO()),
      messages: this.messages.map((messageModel) => messageModel.mapToDTO()),
    };
  }

  getConversationName() {
    return this.conversationName.trim()
      ? this.conversationName
      : this.messages[0]?.sender.nickName.trim()
        ? this.messages[0].sender.nickName
        : `${this.messages[0]?.sender.firstName} ${this.messages[0]?.sender.lastName}`;
  }
}
