export interface UserDTO {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
}

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string | null;
}

export const mapFromDTO = (dto: UserDTO): UserModel => {
  return {
    id: dto._id,
    firstName: dto.first_name,
    lastName: dto.last_name,
    email: dto.email,
    phone: dto.phone ?? "",
    image: dto.image ?? null,
  };
};

export const mapToDTO = (user: UserModel): UserDTO => {
  return {
    _id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    phone: user.phone,
    image: user.image,
  };
};

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
