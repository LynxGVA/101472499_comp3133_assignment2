import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@as-integrations/express4'

dotenv.config()

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    picture: { type: String, default: '' }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
const Employee = mongoose.model('Employee', employeeSchema)

const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    picture: String
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddEmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    picture: String
  }

  input UpdateEmployeeInput {
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    picture: String
  }

  type Query {
    getEmployees(search: String): [Employee!]!
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    signup(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addEmployee(input: AddEmployeeInput!): Employee!
    updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
    deleteEmployee(id: ID!): String!
  }
`

function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function getUserFromRequest(req) {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

function requireAuth(user) {
  if (!user) {
    throw new Error('Unauthorized')
  }
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email)
}

const resolvers = {
  Query: {
    async getEmployees(_, { search }, { user }) {
      requireAuth(user)

      if (!search || !search.trim()) {
        return await Employee.find().sort({ createdAt: -1 })
      }

      return await Employee.find({
        $or: [
          { department: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 })
    },

    async getEmployee(_, { id }, { user }) {
      requireAuth(user)
      return await Employee.findById(id)
    }
  },

  Mutation: {
    async signup(_, { firstName, lastName, email, password }) {
      if (!firstName.trim()) throw new Error('First name is required')
      if (!lastName.trim()) throw new Error('Last name is required')
      if (!email.trim()) throw new Error('Email is required')
      if (!validateEmail(email)) throw new Error('Enter a valid email')
      if (!password.trim()) throw new Error('Password is required')
      if (password.length < 6) throw new Error('Password must be at least 6 characters')

      const existingUser = await User.findOne({ email: email.toLowerCase() })

      if (existingUser) {
        throw new Error('User already exists')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword
      })

      const token = createToken(user)

      return {
        token,
        user
      }
    },

    async login(_, { email, password }) {
      if (!email.trim()) throw new Error('Email is required')
      if (!validateEmail(email)) throw new Error('Enter a valid email')
      if (!password.trim()) throw new Error('Password is required')

      const user = await User.findOne({ email: email.toLowerCase() })

      if (!user) {
        throw new Error('User not found')
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        throw new Error('Invalid password')
      }

      const token = createToken(user)

      return {
        token,
        user
      }
    },

    async addEmployee(_, { input }, { user }) {
      requireAuth(user)

      if (!input.firstName.trim()) throw new Error('First name is required')
      if (!input.lastName.trim()) throw new Error('Last name is required')
      if (!input.email.trim()) throw new Error('Email is required')
      if (!validateEmail(input.email)) throw new Error('Enter a valid email')
      if (!input.department.trim()) throw new Error('Department is required')
      if (!input.position.trim()) throw new Error('Position is required')

      const employee = await Employee.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email.toLowerCase(),
        department: input.department,
        position: input.position,
        picture: input.picture || ''
      })

      return employee
    },

    async updateEmployee(_, { id, input }, { user }) {
      requireAuth(user)

      if (!input.firstName.trim()) throw new Error('First name is required')
      if (!input.lastName.trim()) throw new Error('Last name is required')
      if (!input.email.trim()) throw new Error('Email is required')
      if (!validateEmail(input.email)) throw new Error('Enter a valid email')
      if (!input.department.trim()) throw new Error('Department is required')
      if (!input.position.trim()) throw new Error('Position is required')

      const employee = await Employee.findByIdAndUpdate(
        id,
        {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email.toLowerCase(),
          department: input.department,
          position: input.position,
          picture: input.picture || ''
        },
        { new: true }
      )

      if (!employee) {
        throw new Error('Employee not found')
      }

      return employee
    },

    async deleteEmployee(_, { id }, { user }) {
      requireAuth(user)

      const employee = await Employee.findByIdAndDelete(id)

      if (!employee) {
        throw new Error('Employee not found')
      }

      return 'Employee deleted successfully'
    }
  }
}

await mongoose.connect(process.env.MONGO_URI)

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start()

app.get('/', (req, res) => {
  res.send('Backend is running')
})

app.use(
  '/graphql',
  cors(),
  express.json({ limit: '10mb' }),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const user = getUserFromRequest(req)
      return { user }
    }
  })
)

const PORT = process.env.PORT || 4000

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`)
})