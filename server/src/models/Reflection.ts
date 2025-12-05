import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface ReflectionAttributes {
  id: number;
  user_id: string | number;
  verse_key: string;
  reflection_text: string;
  translation_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ReflectionCreationAttributes extends Optional<ReflectionAttributes, 'id' | 'created_at' | 'updated_at' | 'translation_id'> {}

class Reflection extends Model<ReflectionAttributes, ReflectionCreationAttributes> implements ReflectionAttributes {
  public id!: number;
  public user_id!: string | number;
  public verse_key!: string;
  public reflection_text!: string;
  public translation_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Reflection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User identifier or email from Google auth',
    },
    verse_key: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Verse reference (e.g., 2:255)',
    },
    reflection_text: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'User reflection text',
    },
    translation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Translation ID if reflection was made with specific translation',
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
    tableName: 'reflections',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['verse_key'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

export default Reflection;
