import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  email: string;
  name: string;
  google_id: string;
  profile_image?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'profile_image'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public name!: string;
  public google_id!: string;
  public profile_image?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'User email from Google',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User name from Google profile',
    },
    google_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Google OAuth ID',
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Google profile image URL',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
      {
        fields: ['google_id'],
        unique: true,
      },
    ],
  }
);

export default User;
