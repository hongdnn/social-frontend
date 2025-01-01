export interface UserDTO {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}

export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string | null;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    image: string | null
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.image = image;
  }

  static fromDTO(dto: UserDTO): UserModel {
    return new UserModel(
      dto._id,
      dto.first_name,
      dto.last_name,
      dto.email,
      dto.phone ?? "",
      dto.image ?? null
    );
  }

  mapToDTO(): UserDTO {
    return {
      _id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone || null,
      image: this.image
    };
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}


export const parseUserFromJson = (userString: string | null): UserModel | null => {
    if (!userString) return null;
    
    try {
      const user: UserModel = JSON.parse(userString);
      return user
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  };
