
'''
Required mutations:
 createUser(user: CreateUserDTO!): UserDTO!
 updateUser(id: ID!, user: UpdateUserDTO!): UserDTO!
 deleteUserById(id: ID!): ID
 deleteUserByEmail(email: String!): IDdeleteUserById
 deleteUserByEmail
 
Required queries:
 userById(id: ID!): UserDTO!
 userByEmail(email: String!): UserDTO!
 users: [UserDTO!]!user

CreateUser might look something like:
class CreateUser(graphene.Mutation):
    class Arguments:
        first_name = graphene.String()
        last_name = graphene.String()
        email = graphene.String()
        role = graphene.String()
        
    ok = graphene.Boolean()
    user = graphene.Field(lambda: User)

    def mutate(root, info, name):
        user = User(id, first_name, last_name, email, role)
        ok = True
        return CreateUser(user=user, ok=ok)
'''
