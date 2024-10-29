import { UserNetflix } from "@prisma/client";
import { User } from "next-auth";

export type ProfileProps = {
    users: UserNetflix[];
    };
