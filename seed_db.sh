
# need to have permissions before making this request 
mutation {
  createUser(userData: {
    firstName:"Manuel", lastName:"Neuer", role:User, email:"neuer@dfb.de", password:"bayerndfb"}){
    user {
      id
      firstName
      lastName
      role
      email

    }
  }
}