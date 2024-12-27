export interface MemberDTO {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  image?: string | null;
  nick_name?: string;
}

export class MemberModel {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  image: string;
  nickName: string;

  constructor(
    id: string,
    userId: string,
    firstName: string,
    lastName: string,
    image: string,
    nickName: string
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.image = image;
    this.nickName = nickName;
  }

  static fromDTO(dto: MemberDTO): MemberModel {
    return new MemberModel(
      dto._id,
      dto.user_id,
      dto.first_name,
      dto.last_name,
      dto.image ?? "", 
      dto.nick_name ?? ""
    );
  }

  mapToDTO(): MemberDTO {
    return {
      _id: this.id,
      user_id: this.userId,
      first_name: this.firstName,
      last_name: this.lastName,
      image: this.image || null,
      nick_name: this.nickName,
    };
  }
}
