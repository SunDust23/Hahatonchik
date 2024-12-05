import { Role } from "../entities/role.entity";
import constants from "../../common/constants";

export const rolesProvider = [
  {
    provide: constants.ROLES_REPOSITORY,
    useValue: Role,
  },
];