import sequelize from '../config/database';
import Reflection from './Reflection';
import SearchHistory from './SearchHistory';
import User from './User';

const models = {
  Reflection,
  SearchHistory,
  User,
};

export { sequelize, Reflection, SearchHistory, User };

export default models;
