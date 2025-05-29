import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { JWT_SECRET } from './env'
import prisma from '../database/prisma'
import { Request } from 'express'

const cookieExtractor = (req: Request) => {
  let token = null
  if (req?.cookies) {
    token = req.cookies['token']
  }
  return token
}

passport.use(
  new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_SECRET
  }, async (jwt_payload, done) => {
    try {
      if (!jwt_payload.userId) {
        return done(null, false)
      }

      const user = await prisma.user.findUnique({
        where: {
          id: jwt_payload.userId
        }
      })

      if (user)
        return done(null, {
          id: user.id,
          email: user.email,
          username: user.username,
          telegramChatId: user.telegramChatId
        })
      return done(null, false)
    } catch (err) {
      done(err, false)
    }
  })
)
