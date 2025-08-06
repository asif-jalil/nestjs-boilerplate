import { Routes } from "@nestjs/core";
import { AuthModule } from "./modules/auth/auth.module";
import { ContactModule } from "./modules/contact/contact.module";
import { ProfileModule } from "./modules/profile/profile.module";

const routes: Routes = [
  {
    path: "auth",
    module: AuthModule,
  },
  {
    path: "profile",
    module: ProfileModule,
  },
  {
    path: "contact",
    module: ContactModule,
  },
];

export default routes;
