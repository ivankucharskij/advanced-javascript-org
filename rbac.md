Test Task


You need to implement a backend application - your own authentication and authorization system. The application should not be entirely based on the relevant capabilities of the frameworks that come out of the box.
The main task of development is to think over and propose your own resource access system (You must think over the database schema, describe its components, which will reflect the rules for which resources and what actions a certain user can perform).
The application must implement the following functionality:
The main modules of the system
1. User Interaction
   Allows users to register, log in, log out, update their data, and delete an account.
   Registration: Enter first name (last name, patronymic), email, password, repeat password.
   Update information: The user can edit his profile.
   Deleting a user: Deleting an account (soft) — the user initiates deletion, logout occurs, the user can no longer log in, but the account remains in the database with the status is_active=False.
   Login: the user logs in by email and password.
   Logout: The user logs out.
* After login, the system must identify the user in subsequent requests.
2. Access rights differentiation system.
   You should think about it both in a text file or in REAME.md describe the outline of your access restriction management structure.
   The corresponding tables are implemented in the database.
   The tables are filled with test data for minimal application testing to demonstrate a working system.
   If the user has access to the resource according to the rules described above, he is given the requested resource. If an incoming request fails to identify the logged-in user, a 401 error is returned. If the user is identified, but the requested resource is not available to him, 403 error is Forbidden.
   Implement an API with the ability to receive and modify these rules for a user with the administrator role.

3. Minimal fictional business application objects to which the created system could be applied.
   There is no need to create tables in the database. You can simply write Mock-Views that, based on requests, will give you a list of potential objects or the errors described above.

The choice of technologies is at your discretion. Our advice is DRF + Postgres.

P.S. Even if the task cannot be fully completed, the student will have an understanding of the differences between authentication and authorization, knowledge about the formation of jwt tokens, what sessions are, how they relate to questions and answers from the client and server, how login and logout work in systems, and how to manage the security of any application.



If you have scrolled to this point and it seems to you that the task is very difficult and you do not yet have enough knowledge to come up with such an implementation, change the color of the text in the lines below.

About authentication:
The bcrypt library will help you transfer a user's password for storage in the database.
The jwt library will help you create a token from the user's ID.
You can define the user from header Authorization : Bearer {user_token}, or create a session after the login (additional sessions table, and set a Cookie with sessionid, expire_at in response to the user …
Assign a request to the request immediately.the user before processing the request in the custom Middleware in Django.

About authorization:
You can create tables:
roles to describe user roles in the project (admin, manager, user, guest);
business_elements for describing the application objects to be accessed (users, products, stores, orders, and the access rules themselves);
access_roles_rules for storing access rules for a specific role to a specific application block (columns role_id, element_id, read_permission, read_all_permission, create_permission,update_permission, update_all_permission, delete_permission, delete_all_permission).
All columns ending in _permission are of the bool type and reflect what the user can do with objects — with all objects, or can do something with objects that he created himself (it is assumed that the owner fields would be in the tables (link to user.id )