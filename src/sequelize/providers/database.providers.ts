import { Sequelize } from "sequelize-typescript";
import { User } from "../../user/entities/user.entity";
import { sequelizeConfig } from "../../config";
import { Role } from "src/role/entities/role.entity";
import { UserRoles } from "src/user/entities/user-roles.entity";
import { SavedFilter } from "src/user/entities/filter.entity";


export const dbProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {

      const sequelize = new Sequelize(sequelizeConfig);

      sequelize.addModels([
        User, 
        Role, 
        UserRoles,
        SavedFilter
      ]);
      await sequelize.sync(/*{ alter: true }*/);
      
      return sequelize;
    }
  }
];