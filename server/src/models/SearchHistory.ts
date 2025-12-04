import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SearchHistoryAttributes {
  id: number;
  user_id: string;
  search_query: string;
  created_at?: Date;
}

interface SearchHistoryCreationAttributes extends Optional<SearchHistoryAttributes, 'id' | 'created_at'> {}

class SearchHistory extends Model<SearchHistoryAttributes, SearchHistoryCreationAttributes> implements SearchHistoryAttributes {
  public id!: number;
  public user_id!: string;
  public search_query!: string;
  public readonly created_at!: Date;
}

SearchHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Simulated user identifier',
    },
    search_query: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'search_history',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default SearchHistory;
