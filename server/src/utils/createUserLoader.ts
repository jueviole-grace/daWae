import DataLoader from "dataloader";
import { User } from "../entities/User";
export const createUserLoader = () =>
    new DataLoader<number, User>(async (userIds) => {
      const users = await User.findByIds(userIds as number[]);
      const userIdToUser:Record<number, User> = {}
      users.forEach(u=>{
        userIdToUser[u.id] = u
      })
      const sortedUser = userIds.map(userId => userIdToUser[userId])
      // console.log('userId', userIds); 
      // console.log('map', userIdToUser); 
      // console.log('sortedUser', sortedUser); 
      return sortedUser
    });
