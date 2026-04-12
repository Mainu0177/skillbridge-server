// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";

// src/modules/Auth/auth.route.ts
import { Router } from "express";

// src/modules/Auth/auth.schema.ts
import { z } from "zod";
var registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please provide a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["TUTOR", "STUDENT", "ADMIN"], {
      errorMap: (() => ({ message: "Role must be STUDENT or TUTOR" }))
    })
  })
});
var loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required"
    }).email("Please provide a valid email address"),
    password: z.string({
      required_error: "Password is required"
    }).min(6, "Password must be at least 6 characters long")
  })
});
var authSchemas = {
  registerUserSchema,
  loginSchema
};

// src/modules/student/student.schema.ts
import z2 from "zod";
var changePasswordSchema = z2.object({
  body: z2.object({
    newPassword: z2.string({
      required_error: "newPaaword is required"
    }),
    oldPassword: z2.string({
      required_error: "Old is required"
    })
  })
});
var studentSchemas = { changePasswordSchema };

// src/modules/student/student.service.ts
import bcrypt from "bcrypt";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.1",
  "engineVersion": "55ae170b1ced7fc6ed07a15f110549408c501bb3",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum Status {\n  ACTIVE\n  SUSPENDED\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel User {\n  id            String  @id @default(uuid())\n  name          String\n  email         String  @unique\n  password      String\n  location      String?\n  phoneNumber   String?\n  profileAvatar String?\n  role          Role\n  status        Status  @default(ACTIVE)\n  emailVerified Boolean\n\n  //* Relations\n\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  reviewsGiven    Review[]      @relation("StudentReviews")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel TutorProfile {\n  id           String         @id @default(ulid())\n  userId       String         @unique\n  bio          String\n  hourlyRate   Int\n  experience   String\n  availability Availability[]\n\n  user User @relation(fields: [userId], references: [id])\n\n  subjects   String[]\n  bookings   Booking[]\n  categoryId String\n\n  category  String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n  date      DateTime\n  bookings  Booking[]\n  startTime String\n  isBooked  Boolean      @default(false)\n  endTime   String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id       String   @id @default(uuid())\n  name     String   @unique\n  subjects String[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorId        String\n  dateTime       DateTime\n  status         BookingStatus @default(CONFIRMED)\n  availabilityId String\n\n  //* Relation\n  student User @relation("StudentBookings", fields: [studentId], references: [id])\n\n  tutor TutorProfile @relation(fields: [tutorId], references: [id])\n\n  availability Availability @relation(fields: [availabilityId], references: [id])\n\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Review {\n  id        String @id @default(uuid())\n  bookingId String @unique\n  studentId String\n  tutorId   String\n\n  rating  Int\n  comment String\n\n  //* Relation\n  booking Booking @relation(fields: [bookingId], references: [id])\n  student User    @relation("StudentReviews", fields: [studentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"profileAvatar","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviewsGiven","kind":"object","type":"Review","relationName":"StudentReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"experience","kind":"scalar","type":"String"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"dateTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"StudentReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","tutor","student","availability","booking","review","bookings","_count","user","tutorProfile","studentBookings","reviewsGiven","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","_avg","_sum","TutorProfile.groupBy","TutorProfile.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","bookingId","studentId","tutorId","rating","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","dateTime","BookingStatus","status","availabilityId","name","subjects","has","hasEvery","hasSome","date","startTime","isBooked","endTime","userId","bio","hourlyRate","experience","categoryId","category","every","some","none","email","password","location","phoneNumber","profileAvatar","Role","role","Status","emailVerified","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "iQM4YBILAADRAQAgDAAAwAEAIA0AANIBACB2AADMAQAwdwAAGgAQeAAAzAEAMHkBAAAAAX9AALYBACGAAUAAtgEAIY4BAADPAaoBIpABAQC1AQAhogEBAAAAAaMBAQC1AQAhpAEBAM0BACGlAQEAzQEAIaYBAQDNAQAhqAEAAM4BqAEiqgEgANABACEBAAAAAQAgEAUAAL4BACAIAADAAQAgCgAAvwEAIHYAALwBADB3AAADABB4AAC8AQAweQEAtQEAIX9AALYBACGAAUAAtgEAIZEBAACzAQAgmQEBALUBACGaAQEAtQEAIZsBAgC9AQAhnAEBALUBACGdAQEAtQEAIZ4BAQC1AQAhAQAAAAMAIA0DAADXAQAgCAAAwAEAIHYAANoBADB3AAAFABB4AADaAQAweQEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGVAUAAtgEAIZYBAQC1AQAhlwEgANABACGYAQEAtQEAIQIDAADdAgAgCAAAtQIAIA0DAADXAQAgCAAAwAEAIHYAANoBADB3AAAFABB4AADaAQAweQEAAAABfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhAwAAAAUAIAEAAAYAMAIAAAcAIA8DAADXAQAgBAAAvwEAIAUAANgBACAHAADZAQAgdgAA1QEAMHcAAAkAEHgAANUBADB5AQC1AQAhewEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGMAUAAtgEAIY4BAADWAY4BIo8BAQC1AQAhBAMAAN0CACAEAAC0AgAgBQAA4AIAIAcAAOECACAPAwAA1wEAIAQAAL8BACAFAADYAQAgBwAA2QEAIHYAANUBADB3AAAJABB4AADVAQAweQEAAAABewEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGMAUAAtgEAIY4BAADWAY4BIo8BAQC1AQAhAwAAAAkAIAEAAAoAMAIAAAsAIA0EAAC_AQAgBgAA1AEAIHYAANMBADB3AAANABB4AADTAQAweQEAtQEAIXoBALUBACF7AQC1AQAhfAEAtQEAIX0CAL0BACF-AQC1AQAhf0AAtgEAIYABQAC2AQAhAQAAAA0AIAEAAAAJACADAAAACQAgAQAACgAwAgAACwAgAQAAAAUAIAEAAAAJACADAAAACQAgAQAACgAwAgAACwAgAgQAALQCACAGAADfAgAgDQQAAL8BACAGAADUAQAgdgAA0wEAMHcAAA0AEHgAANMBADB5AQAAAAF6AQAAAAF7AQC1AQAhfAEAtQEAIX0CAL0BACF-AQC1AQAhf0AAtgEAIYABQAC2AQAhAwAAAA0AIAEAABQAMAIAABUAIAEAAAAJACABAAAADQAgAQAAAAEAIBILAADRAQAgDAAAwAEAIA0AANIBACB2AADMAQAwdwAAGgAQeAAAzAEAMHkBALUBACF_QAC2AQAhgAFAALYBACGOAQAAzwGqASKQAQEAtQEAIaIBAQC1AQAhowEBALUBACGkAQEAzQEAIaUBAQDNAQAhpgEBAM0BACGoAQAAzgGoASKqASAA0AEAIQYLAADdAgAgDAAAtQIAIA0AAN4CACCkAQAAtgIAIKUBAAC2AgAgpgEAALYCACADAAAAGgAgAQAAGwAwAgAAAQAgAwAAABoAIAEAABsAMAIAAAEAIAMAAAAaACABAAAbADACAAABACAPCwAA2gIAIAwAANsCACANAADcAgAgeQEAAAABf0AAAAABgAFAAAAAAY4BAAAAqgECkAEBAAAAAaIBAQAAAAGjAQEAAAABpAEBAAAAAaUBAQAAAAGmAQEAAAABqAEAAACoAQKqASAAAAABARMAAB8AIAx5AQAAAAF_QAAAAAGAAUAAAAABjgEAAACqAQKQAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpQEBAAAAAaYBAQAAAAGoAQAAAKgBAqoBIAAAAAEBEwAAIQAwARMAACEAMA8LAAC9AgAgDAAAvgIAIA0AAL8CACB5AQDgAQAhf0AA4gEAIYABQADiAQAhjgEAALwCqgEikAEBAOABACGiAQEA4AEAIaMBAQDgAQAhpAEBALoCACGlAQEAugIAIaYBAQC6AgAhqAEAALsCqAEiqgEgAIACACECAAAAAQAgEwAAJAAgDHkBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKqASKQAQEA4AEAIaIBAQDgAQAhowEBAOABACGkAQEAugIAIaUBAQC6AgAhpgEBALoCACGoAQAAuwKoASKqASAAgAIAIQIAAAAaACATAAAmACACAAAAGgAgEwAAJgAgAwAAAAEAIBoAAB8AIBsAACQAIAEAAAABACABAAAAGgAgBgkAALcCACAgAAC5AgAgIQAAuAIAIKQBAAC2AgAgpQEAALYCACCmAQAAtgIAIA92AADBAQAwdwAALQAQeAAAwQEAMHkBAKQBACF_QACmAQAhgAFAAKYBACGOAQAAxAGqASKQAQEApAEAIaIBAQCkAQAhowEBAKQBACGkAQEAwgEAIaUBAQDCAQAhpgEBAMIBACGoAQAAwwGoASKqASAAuAEAIQMAAAAaACABAAAsADAfAAAtACADAAAAGgAgAQAAGwAwAgAAAQAgEAUAAL4BACAIAADAAQAgCgAAvwEAIHYAALwBADB3AAADABB4AAC8AQAweQEAAAABf0AAtgEAIYABQAC2AQAhkQEAALMBACCZAQEAAAABmgEBALUBACGbAQIAvQEAIZwBAQC1AQAhnQEBALUBACGeAQEAtQEAIQEAAAAwACABAAAAMAAgAwUAALMCACAIAAC1AgAgCgAAtAIAIAMAAAADACABAAAzADACAAAwACADAAAAAwAgAQAAMwAwAgAAMAAgAwAAAAMAIAEAADMAMAIAADAAIA0FAACwAgAgCAAAsgIAIAoAALECACB5AQAAAAF_QAAAAAGAAUAAAAABkQEAAK8CACCZAQEAAAABmgEBAAAAAZsBAgAAAAGcAQEAAAABnQEBAAAAAZ4BAQAAAAEBEwAANwAgCnkBAAAAAX9AAAAAAYABQAAAAAGRAQAArwIAIJkBAQAAAAGaAQEAAAABmwECAAAAAZwBAQAAAAGdAQEAAAABngEBAAAAAQETAAA5ADABEwAAOQAwDQUAAJcCACAIAACZAgAgCgAAmAIAIHkBAOABACF_QADiAQAhgAFAAOIBACGRAQAAlgIAIJkBAQDgAQAhmgEBAOABACGbAQIA4QEAIZwBAQDgAQAhnQEBAOABACGeAQEA4AEAIQIAAAAwACATAAA8ACAKeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIZ4BAQDgAQAhAgAAAAMAIBMAAD4AIAIAAAADACATAAA-ACADAAAAMAAgGgAANwAgGwAAPAAgAQAAADAAIAEAAAADACAFCQAAkQIAICAAAJQCACAhAACTAgAgMgAAkgIAIDMAAJUCACANdgAAuwEAMHcAAEUAEHgAALsBADB5AQCkAQAhf0AApgEAIYABQACmAQAhkQEAALMBACCZAQEApAEAIZoBAQCkAQAhmwECAKUBACGcAQEApAEAIZ0BAQCkAQAhngEBAKQBACEDAAAAAwAgAQAARAAwHwAARQAgAwAAAAMAIAEAADMAMAIAADAAIAEAAAAHACABAAAABwAgAwAAAAUAIAEAAAYAMAIAAAcAIAMAAAAFACABAAAGADACAAAHACADAAAABQAgAQAABgAwAgAABwAgCgMAAI8CACAIAACQAgAgeQEAAAABfAEAAAABf0AAAAABgAFAAAAAAZUBQAAAAAGWAQEAAAABlwEgAAAAAZgBAQAAAAEBEwAATQAgCHkBAAAAAXwBAAAAAX9AAAAAAYABQAAAAAGVAUAAAAABlgEBAAAAAZcBIAAAAAGYAQEAAAABARMAAE8AMAETAABPADAKAwAAgQIAIAgAAIICACB5AQDgAQAhfAEA4AEAIX9AAOIBACGAAUAA4gEAIZUBQADiAQAhlgEBAOABACGXASAAgAIAIZgBAQDgAQAhAgAAAAcAIBMAAFIAIAh5AQDgAQAhfAEA4AEAIX9AAOIBACGAAUAA4gEAIZUBQADiAQAhlgEBAOABACGXASAAgAIAIZgBAQDgAQAhAgAAAAUAIBMAAFQAIAIAAAAFACATAABUACADAAAABwAgGgAATQAgGwAAUgAgAQAAAAcAIAEAAAAFACADCQAA_QEAICAAAP8BACAhAAD-AQAgC3YAALcBADB3AABbABB4AAC3AQAweQEApAEAIXwBAKQBACF_QACmAQAhgAFAAKYBACGVAUAApgEAIZYBAQCkAQAhlwEgALgBACGYAQEApAEAIQMAAAAFACABAABaADAfAABbACADAAAABQAgAQAABgAwAgAABwAgCHYAALQBADB3AABhABB4AAC0AQAweQEAAAABf0AAtgEAIYABQAC2AQAhkAEBAAAAAZEBAACzAQAgAQAAAF4AIAEAAABeACAIdgAAtAEAMHcAAGEAEHgAALQBADB5AQC1AQAhf0AAtgEAIYABQAC2AQAhkAEBALUBACGRAQAAswEAIAADAAAAYQAgAQAAYgAwAgAAXgAgAwAAAGEAIAEAAGIAMAIAAF4AIAMAAABhACABAABiADACAABeACAFeQEAAAABf0AAAAABgAFAAAAAAZABAQAAAAGRAQAA_AEAIAETAABmACAFeQEAAAABf0AAAAABgAFAAAAAAZABAQAAAAGRAQAA_AEAIAETAABoADABEwAAaAAwBXkBAOABACF_QADiAQAhgAFAAOIBACGQAQEA4AEAIZEBAAD7AQAgAgAAAF4AIBMAAGsAIAV5AQDgAQAhf0AA4gEAIYABQADiAQAhkAEBAOABACGRAQAA-wEAIAIAAABhACATAABtACACAAAAYQAgEwAAbQAgAwAAAF4AIBoAAGYAIBsAAGsAIAEAAABeACABAAAAYQAgAwkAAPgBACAgAAD6AQAgIQAA-QEAIAh2AACyAQAwdwAAdAAQeAAAsgEAMHkBAKQBACF_QACmAQAhgAFAAKYBACGQAQEApAEAIZEBAACzAQAgAwAAAGEAIAEAAHMAMB8AAHQAIAMAAABhACABAABiADACAABeACABAAAACwAgAQAAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAwDAAD1AQAgBAAA9AEAIAUAAPYBACAHAAD3AQAgeQEAAAABewEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAEBEwAAfAAgCHkBAAAAAXsBAAAAAXwBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQKPAQEAAAABARMAAH4AMAETAAB-ADAMAwAA7AEAIAQAAOsBACAFAADtAQAgBwAA7gEAIHkBAOABACF7AQDgAQAhfAEA4AEAIX9AAOIBACGAAUAA4gEAIYwBQADiAQAhjgEAAOoBjgEijwEBAOABACECAAAACwAgEwAAgQEAIAh5AQDgAQAhewEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGMAUAA4gEAIY4BAADqAY4BIo8BAQDgAQAhAgAAAAkAIBMAAIMBACACAAAACQAgEwAAgwEAIAMAAAALACAaAAB8ACAbAACBAQAgAQAAAAsAIAEAAAAJACADCQAA5wEAICAAAOkBACAhAADoAQAgC3YAAK4BADB3AACKAQAQeAAArgEAMHkBAKQBACF7AQCkAQAhfAEApAEAIX9AAKYBACGAAUAApgEAIYwBQACmAQAhjgEAAK8BjgEijwEBAKQBACEDAAAACQAgAQAAiQEAMB8AAIoBACADAAAACQAgAQAACgAwAgAACwAgAQAAABUAIAEAAAAVACADAAAADQAgAQAAFAAwAgAAFQAgAwAAAA0AIAEAABQAMAIAABUAIAMAAAANACABAAAUADACAAAVACAKBAAA5gEAIAYAAOUBACB5AQAAAAF6AQAAAAF7AQAAAAF8AQAAAAF9AgAAAAF-AQAAAAF_QAAAAAGAAUAAAAABARMAAJIBACAIeQEAAAABegEAAAABewEAAAABfAEAAAABfQIAAAABfgEAAAABf0AAAAABgAFAAAAAAQETAACUAQAwARMAAJQBADAKBAAA5AEAIAYAAOMBACB5AQDgAQAhegEA4AEAIXsBAOABACF8AQDgAQAhfQIA4QEAIX4BAOABACF_QADiAQAhgAFAAOIBACECAAAAFQAgEwAAlwEAIAh5AQDgAQAhegEA4AEAIXsBAOABACF8AQDgAQAhfQIA4QEAIX4BAOABACF_QADiAQAhgAFAAOIBACECAAAADQAgEwAAmQEAIAIAAAANACATAACZAQAgAwAAABUAIBoAAJIBACAbAACXAQAgAQAAABUAIAEAAAANACAFCQAA2wEAICAAAN4BACAhAADdAQAgMgAA3AEAIDMAAN8BACALdgAAowEAMHcAAKABABB4AACjAQAweQEApAEAIXoBAKQBACF7AQCkAQAhfAEApAEAIX0CAKUBACF-AQCkAQAhf0AApgEAIYABQACmAQAhAwAAAA0AIAEAAJ8BADAfAACgAQAgAwAAAA0AIAEAABQAMAIAABUAIAt2AACjAQAwdwAAoAEAEHgAAKMBADB5AQCkAQAhegEApAEAIXsBAKQBACF8AQCkAQAhfQIApQEAIX4BAKQBACF_QACmAQAhgAFAAKYBACEOCQAAqAEAICAAAK0BACAhAACtAQAggQEBAAAAAYIBAQAAAASDAQEAAAAEhAEBAAAAAYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQCsAQAhiQEBAAAAAYoBAQAAAAGLAQEAAAABDQkAAKgBACAgAACoAQAgIQAAqAEAIDIAAKsBACAzAACoAQAggQECAAAAAYIBAgAAAASDAQIAAAAEhAECAAAAAYUBAgAAAAGGAQIAAAABhwECAAAAAYgBAgCqAQAhCwkAAKgBACAgAACpAQAgIQAAqQEAIIEBQAAAAAGCAUAAAAAEgwFAAAAABIQBQAAAAAGFAUAAAAABhgFAAAAAAYcBQAAAAAGIAUAApwEAIQsJAACoAQAgIAAAqQEAICEAAKkBACCBAUAAAAABggFAAAAABIMBQAAAAASEAUAAAAABhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAKcBACEIgQECAAAAAYIBAgAAAASDAQIAAAAEhAECAAAAAYUBAgAAAAGGAQIAAAABhwECAAAAAYgBAgCoAQAhCIEBQAAAAAGCAUAAAAAEgwFAAAAABIQBQAAAAAGFAUAAAAABhgFAAAAAAYcBQAAAAAGIAUAAqQEAIQ0JAACoAQAgIAAAqAEAICEAAKgBACAyAACrAQAgMwAAqAEAIIEBAgAAAAGCAQIAAAAEgwECAAAABIQBAgAAAAGFAQIAAAABhgECAAAAAYcBAgAAAAGIAQIAqgEAIQiBAQgAAAABggEIAAAABIMBCAAAAASEAQgAAAABhQEIAAAAAYYBCAAAAAGHAQgAAAABiAEIAKsBACEOCQAAqAEAICAAAK0BACAhAACtAQAggQEBAAAAAYIBAQAAAASDAQEAAAAEhAEBAAAAAYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQCsAQAhiQEBAAAAAYoBAQAAAAGLAQEAAAABC4EBAQAAAAGCAQEAAAAEgwEBAAAABIQBAQAAAAGFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEArQEAIYkBAQAAAAGKAQEAAAABiwEBAAAAAQt2AACuAQAwdwAAigEAEHgAAK4BADB5AQCkAQAhewEApAEAIXwBAKQBACF_QACmAQAhgAFAAKYBACGMAUAApgEAIY4BAACvAY4BIo8BAQCkAQAhBwkAAKgBACAgAACxAQAgIQAAsQEAIIEBAAAAjgECggEAAACOAQiDAQAAAI4BCIgBAACwAY4BIgcJAACoAQAgIAAAsQEAICEAALEBACCBAQAAAI4BAoIBAAAAjgEIgwEAAACOAQiIAQAAsAGOASIEgQEAAACOAQKCAQAAAI4BCIMBAAAAjgEIiAEAALEBjgEiCHYAALIBADB3AAB0ABB4AACyAQAweQEApAEAIX9AAKYBACGAAUAApgEAIZABAQCkAQAhkQEAALMBACAEgQEBAAAABZIBAQAAAAGTAQEAAAAElAEBAAAABAh2AAC0AQAwdwAAYQAQeAAAtAEAMHkBALUBACF_QAC2AQAhgAFAALYBACGQAQEAtQEAIZEBAACzAQAgC4EBAQAAAAGCAQEAAAAEgwEBAAAABIQBAQAAAAGFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEArQEAIYkBAQAAAAGKAQEAAAABiwEBAAAAAQiBAUAAAAABggFAAAAABIMBQAAAAASEAUAAAAABhQFAAAAAAYYBQAAAAAGHAUAAAAABiAFAAKkBACELdgAAtwEAMHcAAFsAEHgAALcBADB5AQCkAQAhfAEApAEAIX9AAKYBACGAAUAApgEAIZUBQACmAQAhlgEBAKQBACGXASAAuAEAIZgBAQCkAQAhBQkAAKgBACAgAAC6AQAgIQAAugEAIIEBIAAAAAGIASAAuQEAIQUJAACoAQAgIAAAugEAICEAALoBACCBASAAAAABiAEgALkBACECgQEgAAAAAYgBIAC6AQAhDXYAALsBADB3AABFABB4AAC7AQAweQEApAEAIX9AAKYBACGAAUAApgEAIZEBAACzAQAgmQEBAKQBACGaAQEApAEAIZsBAgClAQAhnAEBAKQBACGdAQEApAEAIZ4BAQCkAQAhEAUAAL4BACAIAADAAQAgCgAAvwEAIHYAALwBADB3AAADABB4AAC8AQAweQEAtQEAIX9AALYBACGAAUAAtgEAIZEBAACzAQAgmQEBALUBACGaAQEAtQEAIZsBAgC9AQAhnAEBALUBACGdAQEAtQEAIZ4BAQC1AQAhCIEBAgAAAAGCAQIAAAAEgwECAAAABIQBAgAAAAGFAQIAAAABhgECAAAAAYcBAgAAAAGIAQIAqAEAIQOfAQAABQAgoAEAAAUAIKEBAAAFACAUCwAA0QEAIAwAAMABACANAADSAQAgdgAAzAEAMHcAABoAEHgAAMwBADB5AQC1AQAhf0AAtgEAIYABQAC2AQAhjgEAAM8BqgEikAEBALUBACGiAQEAtQEAIaMBAQC1AQAhpAEBAM0BACGlAQEAzQEAIaYBAQDNAQAhqAEAAM4BqAEiqgEgANABACGrAQAAGgAgrAEAABoAIAOfAQAACQAgoAEAAAkAIKEBAAAJACAPdgAAwQEAMHcAAC0AEHgAAMEBADB5AQCkAQAhf0AApgEAIYABQACmAQAhjgEAAMQBqgEikAEBAKQBACGiAQEApAEAIaMBAQCkAQAhpAEBAMIBACGlAQEAwgEAIaYBAQDCAQAhqAEAAMMBqAEiqgEgALgBACEOCQAAygEAICAAAMsBACAhAADLAQAggQEBAAAAAYIBAQAAAAWDAQEAAAAFhAEBAAAAAYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQDJAQAhiQEBAAAAAYoBAQAAAAGLAQEAAAABBwkAAKgBACAgAADIAQAgIQAAyAEAIIEBAAAAqAECggEAAACoAQiDAQAAAKgBCIgBAADHAagBIgcJAACoAQAgIAAAxgEAICEAAMYBACCBAQAAAKoBAoIBAAAAqgEIgwEAAACqAQiIAQAAxQGqASIHCQAAqAEAICAAAMYBACAhAADGAQAggQEAAACqAQKCAQAAAKoBCIMBAAAAqgEIiAEAAMUBqgEiBIEBAAAAqgECggEAAACqAQiDAQAAAKoBCIgBAADGAaoBIgcJAACoAQAgIAAAyAEAICEAAMgBACCBAQAAAKgBAoIBAAAAqAEIgwEAAACoAQiIAQAAxwGoASIEgQEAAACoAQKCAQAAAKgBCIMBAAAAqAEIiAEAAMgBqAEiDgkAAMoBACAgAADLAQAgIQAAywEAIIEBAQAAAAGCAQEAAAAFgwEBAAAABYQBAQAAAAGFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAyQEAIYkBAQAAAAGKAQEAAAABiwEBAAAAAQiBAQIAAAABggECAAAABYMBAgAAAAWEAQIAAAABhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAMoBACELgQEBAAAAAYIBAQAAAAWDAQEAAAAFhAEBAAAAAYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQDLAQAhiQEBAAAAAYoBAQAAAAGLAQEAAAABEgsAANEBACAMAADAAQAgDQAA0gEAIHYAAMwBADB3AAAaABB4AADMAQAweQEAtQEAIX9AALYBACGAAUAAtgEAIY4BAADPAaoBIpABAQC1AQAhogEBALUBACGjAQEAtQEAIaQBAQDNAQAhpQEBAM0BACGmAQEAzQEAIagBAADOAagBIqoBIADQAQAhC4EBAQAAAAGCAQEAAAAFgwEBAAAABYQBAQAAAAGFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAywEAIYkBAQAAAAGKAQEAAAABiwEBAAAAAQSBAQAAAKgBAoIBAAAAqAEIgwEAAACoAQiIAQAAyAGoASIEgQEAAACqAQKCAQAAAKoBCIMBAAAAqgEIiAEAAMYBqgEiAoEBIAAAAAGIASAAugEAIRIFAAC-AQAgCAAAwAEAIAoAAL8BACB2AAC8AQAwdwAAAwAQeAAAvAEAMHkBALUBACF_QAC2AQAhgAFAALYBACGRAQAAswEAIJkBAQC1AQAhmgEBALUBACGbAQIAvQEAIZwBAQC1AQAhnQEBALUBACGeAQEAtQEAIasBAAADACCsAQAAAwAgA58BAAANACCgAQAADQAgoQEAAA0AIA0EAAC_AQAgBgAA1AEAIHYAANMBADB3AAANABB4AADTAQAweQEAtQEAIXoBALUBACF7AQC1AQAhfAEAtQEAIX0CAL0BACF-AQC1AQAhf0AAtgEAIYABQAC2AQAhEQMAANcBACAEAAC_AQAgBQAA2AEAIAcAANkBACB2AADVAQAwdwAACQAQeAAA1QEAMHkBALUBACF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACGrAQAACQAgrAEAAAkAIA8DAADXAQAgBAAAvwEAIAUAANgBACAHAADZAQAgdgAA1QEAMHcAAAkAEHgAANUBADB5AQC1AQAhewEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGMAUAAtgEAIY4BAADWAY4BIo8BAQC1AQAhBIEBAAAAjgECggEAAACOAQiDAQAAAI4BCIgBAACxAY4BIhIFAAC-AQAgCAAAwAEAIAoAAL8BACB2AAC8AQAwdwAAAwAQeAAAvAEAMHkBALUBACF_QAC2AQAhgAFAALYBACGRAQAAswEAIJkBAQC1AQAhmgEBALUBACGbAQIAvQEAIZwBAQC1AQAhnQEBALUBACGeAQEAtQEAIasBAAADACCsAQAAAwAgDwMAANcBACAIAADAAQAgdgAA2gEAMHcAAAUAEHgAANoBADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhqwEAAAUAIKwBAAAFACAPBAAAvwEAIAYAANQBACB2AADTAQAwdwAADQAQeAAA0wEAMHkBALUBACF6AQC1AQAhewEAtQEAIXwBALUBACF9AgC9AQAhfgEAtQEAIX9AALYBACGAAUAAtgEAIasBAAANACCsAQAADQAgDQMAANcBACAIAADAAQAgdgAA2gEAMHcAAAUAEHgAANoBADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhAAAAAAABswEBAAAAAQWzAQIAAAABtwECAAAAAbgBAgAAAAG5AQIAAAABugECAAAAAQGzAUAAAAABBRoAAIIDACAbAACIAwAgrQEAAIMDACCuAQAAhwMAILEBAAALACAFGgAAgAMAIBsAAIUDACCtAQAAgQMAIK4BAACEAwAgsQEAAAEAIAMaAACCAwAgrQEAAIMDACCxAQAACwAgAxoAAIADACCtAQAAgQMAILEBAAABACAAAAABswEAAACOAQIFGgAA9QIAIBsAAP4CACCtAQAA9gIAIK4BAAD9AgAgsQEAAAEAIAUaAADzAgAgGwAA-wIAIK0BAAD0AgAgrgEAAPoCACCxAQAAMAAgBRoAAPECACAbAAD4AgAgrQEAAPICACCuAQAA9wIAILEBAAAHACAHGgAA7wEAIBsAAPIBACCtAQAA8AEAIK4BAADxAQAgrwEAAA0AILABAAANACCxAQAAFQAgCAQAAOYBACB5AQAAAAF7AQAAAAF8AQAAAAF9AgAAAAF-AQAAAAF_QAAAAAGAAUAAAAABAgAAABUAIBoAAO8BACADAAAADQAgGgAA7wEAIBsAAPMBACAKAAAADQAgBAAA5AEAIBMAAPMBACB5AQDgAQAhewEA4AEAIXwBAOABACF9AgDhAQAhfgEA4AEAIX9AAOIBACGAAUAA4gEAIQgEAADkAQAgeQEA4AEAIXsBAOABACF8AQDgAQAhfQIA4QEAIX4BAOABACF_QADiAQAhgAFAAOIBACEDGgAA9QIAIK0BAAD2AgAgsQEAAAEAIAMaAADzAgAgrQEAAPQCACCxAQAAMAAgAxoAAPECACCtAQAA8gIAILEBAAAHACADGgAA7wEAIK0BAADwAQAgsQEAABUAIAAAAAKzAQEAAAAEtgEBAAAABQGzAQEAAAAEAAAAAbMBIAAAAAEFGgAA6wIAIBsAAO8CACCtAQAA7AIAIK4BAADuAgAgsQEAADAAIAsaAACDAgAwGwAAiAIAMK0BAACEAgAwrgEAAIUCADCvAQAAhwIAMLABAACHAgAwsQEAAIcCADCyAQAAhgIAILMBAACHAgAwtAEAAIkCADC1AQAAigIAMAoDAAD1AQAgBAAA9AEAIAcAAPcBACB5AQAAAAF7AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECAgAAAAsAIBoAAI4CACADAAAACwAgGgAAjgIAIBsAAI0CACABEwAA7QIAMA8DAADXAQAgBAAAvwEAIAUAANgBACAHAADZAQAgdgAA1QEAMHcAAAkAEHgAANUBADB5AQAAAAF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACECAAAACwAgEwAAjQIAIAIAAACLAgAgEwAAjAIAIAt2AACKAgAwdwAAiwIAEHgAAIoCADB5AQC1AQAhewEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGMAUAAtgEAIY4BAADWAY4BIo8BAQC1AQAhC3YAAIoCADB3AACLAgAQeAAAigIAMHkBALUBACF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACEHeQEA4AEAIXsBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASIKAwAA7AEAIAQAAOsBACAHAADuAQAgeQEA4AEAIXsBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASIKAwAA9QEAIAQAAPQBACAHAAD3AQAgeQEAAAABewEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAgMaAADrAgAgrQEAAOwCACCxAQAAMAAgBBoAAIMCADCtAQAAhAIAMLEBAACHAgAwsgEAAIYCACAAAAAAAAKzAQEAAAAEtgEBAAAABQsaAACjAgAwGwAAqAIAMK0BAACkAgAwrgEAAKUCADCvAQAApwIAMLABAACnAgAwsQEAAKcCADCyAQAApgIAILMBAACnAgAwtAEAAKkCADC1AQAAqgIAMAUaAADkAgAgGwAA6QIAIK0BAADlAgAgrgEAAOgCACCxAQAAAQAgCxoAAJoCADAbAACeAgAwrQEAAJsCADCuAQAAnAIAMK8BAACHAgAwsAEAAIcCADCxAQAAhwIAMLIBAACdAgAgswEAAIcCADC0AQAAnwIAMLUBAACKAgAwCgQAAPQBACAFAAD2AQAgBwAA9wEAIHkBAAAAAXsBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQKPAQEAAAABAgAAAAsAIBoAAKICACADAAAACwAgGgAAogIAIBsAAKECACABEwAA5wIAMAIAAAALACATAAChAgAgAgAAAIsCACATAACgAgAgB3kBAOABACF7AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASKPAQEA4AEAIQoEAADrAQAgBQAA7QEAIAcAAO4BACB5AQDgAQAhewEA4AEAIX9AAOIBACGAAUAA4gEAIYwBQADiAQAhjgEAAOoBjgEijwEBAOABACEKBAAA9AEAIAUAAPYBACAHAAD3AQAgeQEAAAABewEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAEICAAAkAIAIHkBAAAAAX9AAAAAAYABQAAAAAGVAUAAAAABlgEBAAAAAZcBIAAAAAGYAQEAAAABAgAAAAcAIBoAAK4CACADAAAABwAgGgAArgIAIBsAAK0CACABEwAA5gIAMA0DAADXAQAgCAAAwAEAIHYAANoBADB3AAAFABB4AADaAQAweQEAAAABfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhAgAAAAcAIBMAAK0CACACAAAAqwIAIBMAAKwCACALdgAAqgIAMHcAAKsCABB4AACqAgAweQEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGVAUAAtgEAIZYBAQC1AQAhlwEgANABACGYAQEAtQEAIQt2AACqAgAwdwAAqwIAEHgAAKoCADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhB3kBAOABACF_QADiAQAhgAFAAOIBACGVAUAA4gEAIZYBAQDgAQAhlwEgAIACACGYAQEA4AEAIQgIAACCAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZUBQADiAQAhlgEBAOABACGXASAAgAIAIZgBAQDgAQAhCAgAAJACACB5AQAAAAF_QAAAAAGAAUAAAAABlQFAAAAAAZYBAQAAAAGXASAAAAABmAEBAAAAAQGzAQEAAAAEBBoAAKMCADCtAQAApAIAMLEBAACnAgAwsgEAAKYCACADGgAA5AIAIK0BAADlAgAgsQEAAAEAIAQaAACaAgAwrQEAAJsCADCxAQAAhwIAMLIBAACdAgAgAAYLAADdAgAgDAAAtQIAIA0AAN4CACCkAQAAtgIAIKUBAAC2AgAgpgEAALYCACAAAAAAAAGzAQEAAAABAbMBAAAAqAECAbMBAAAAqgECBxoAANUCACAbAADYAgAgrQEAANYCACCuAQAA1wIAIK8BAAADACCwAQAAAwAgsQEAADAAIAsaAADMAgAwGwAA0AIAMK0BAADNAgAwrgEAAM4CADCvAQAAhwIAMLABAACHAgAwsQEAAIcCADCyAQAAzwIAILMBAACHAgAwtAEAANECADC1AQAAigIAMAsaAADAAgAwGwAAxQIAMK0BAADBAgAwrgEAAMICADCvAQAAxAIAMLABAADEAgAwsQEAAMQCADCyAQAAwwIAILMBAADEAgAwtAEAAMYCADC1AQAAxwIAMAgGAADlAQAgeQEAAAABegEAAAABfAEAAAABfQIAAAABfgEAAAABf0AAAAABgAFAAAAAAQIAAAAVACAaAADLAgAgAwAAABUAIBoAAMsCACAbAADKAgAgARMAAOMCADANBAAAvwEAIAYAANQBACB2AADTAQAwdwAADQAQeAAA0wEAMHkBAAAAAXoBAAAAAXsBALUBACF8AQC1AQAhfQIAvQEAIX4BALUBACF_QAC2AQAhgAFAALYBACECAAAAFQAgEwAAygIAIAIAAADIAgAgEwAAyQIAIAt2AADHAgAwdwAAyAIAEHgAAMcCADB5AQC1AQAhegEAtQEAIXsBALUBACF8AQC1AQAhfQIAvQEAIX4BALUBACF_QAC2AQAhgAFAALYBACELdgAAxwIAMHcAAMgCABB4AADHAgAweQEAtQEAIXoBALUBACF7AQC1AQAhfAEAtQEAIX0CAL0BACF-AQC1AQAhf0AAtgEAIYABQAC2AQAhB3kBAOABACF6AQDgAQAhfAEA4AEAIX0CAOEBACF-AQDgAQAhf0AA4gEAIYABQADiAQAhCAYAAOMBACB5AQDgAQAhegEA4AEAIXwBAOABACF9AgDhAQAhfgEA4AEAIX9AAOIBACGAAUAA4gEAIQgGAADlAQAgeQEAAAABegEAAAABfAEAAAABfQIAAAABfgEAAAABf0AAAAABgAFAAAAAAQoDAAD1AQAgBQAA9gEAIAcAAPcBACB5AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECjwEBAAAAAQIAAAALACAaAADUAgAgAwAAAAsAIBoAANQCACAbAADTAgAgARMAAOICADACAAAACwAgEwAA0wIAIAIAAACLAgAgEwAA0gIAIAd5AQDgAQAhfAEA4AEAIX9AAOIBACGAAUAA4gEAIYwBQADiAQAhjgEAAOoBjgEijwEBAOABACEKAwAA7AEAIAUAAO0BACAHAADuAQAgeQEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGMAUAA4gEAIY4BAADqAY4BIo8BAQDgAQAhCgMAAPUBACAFAAD2AQAgBwAA9wEAIHkBAAAAAXwBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQKPAQEAAAABCwUAALACACAIAACyAgAgeQEAAAABf0AAAAABgAFAAAAAAZEBAACvAgAgmgEBAAAAAZsBAgAAAAGcAQEAAAABnQEBAAAAAZ4BAQAAAAECAAAAMAAgGgAA1QIAIAMAAAADACAaAADVAgAgGwAA2QIAIA0AAAADACAFAACXAgAgCAAAmQIAIBMAANkCACB5AQDgAQAhf0AA4gEAIYABQADiAQAhkQEAAJYCACCaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIZ4BAQDgAQAhCwUAAJcCACAIAACZAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmgEBAOABACGbAQIA4QEAIZwBAQDgAQAhnQEBAOABACGeAQEA4AEAIQMaAADVAgAgrQEAANYCACCxAQAAMAAgBBoAAMwCADCtAQAAzQIAMLEBAACHAgAwsgEAAM8CACAEGgAAwAIAMK0BAADBAgAwsQEAAMQCADCyAQAAwwIAIAMFAACzAgAgCAAAtQIAIAoAALQCACAABAMAAN0CACAEAAC0AgAgBQAA4AIAIAcAAOECACACAwAA3QIAIAgAALUCACACBAAAtAIAIAYAAN8CACAHeQEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAEHeQEAAAABegEAAAABfAEAAAABfQIAAAABfgEAAAABf0AAAAABgAFAAAAAAQ4MAADbAgAgDQAA3AIAIHkBAAAAAX9AAAAAAYABQAAAAAGOAQAAAKoBApABAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEgAAAAAQIAAAABACAaAADkAgAgB3kBAAAAAX9AAAAAAYABQAAAAAGVAUAAAAABlgEBAAAAAZcBIAAAAAGYAQEAAAABB3kBAAAAAXsBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQKPAQEAAAABAwAAABoAIBoAAOQCACAbAADqAgAgEAAAABoAIAwAAL4CACANAAC_AgAgEwAA6gIAIHkBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKqASKQAQEA4AEAIaIBAQDgAQAhowEBAOABACGkAQEAugIAIaUBAQC6AgAhpgEBALoCACGoAQAAuwKoASKqASAAgAIAIQ4MAAC-AgAgDQAAvwIAIHkBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKqASKQAQEA4AEAIaIBAQDgAQAhowEBAOABACGkAQEAugIAIaUBAQC6AgAhpgEBALoCACGoAQAAuwKoASKqASAAgAIAIQwIAACyAgAgCgAAsQIAIHkBAAAAAX9AAAAAAYABQAAAAAGRAQAArwIAIJkBAQAAAAGaAQEAAAABmwECAAAAAZwBAQAAAAGdAQEAAAABngEBAAAAAQIAAAAwACAaAADrAgAgB3kBAAAAAXsBAAAAAXwBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQIDAAAAAwAgGgAA6wIAIBsAAPACACAOAAAAAwAgCAAAmQIAIAoAAJgCACATAADwAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIZ4BAQDgAQAhDAgAAJkCACAKAACYAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIZ4BAQDgAQAhCQMAAI8CACB5AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABlQFAAAAAAZYBAQAAAAGXASAAAAABmAEBAAAAAQIAAAAHACAaAADxAgAgDAUAALACACAKAACxAgAgeQEAAAABf0AAAAABgAFAAAAAAZEBAACvAgAgmQEBAAAAAZoBAQAAAAGbAQIAAAABnAEBAAAAAZ0BAQAAAAGeAQEAAAABAgAAADAAIBoAAPMCACAOCwAA2gIAIA0AANwCACB5AQAAAAF_QAAAAAGAAUAAAAABjgEAAACqAQKQAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpQEBAAAAAaYBAQAAAAGoAQAAAKgBAqoBIAAAAAECAAAAAQAgGgAA9QIAIAMAAAAFACAaAADxAgAgGwAA-QIAIAsAAAAFACADAACBAgAgEwAA-QIAIHkBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhlQFAAOIBACGWAQEA4AEAIZcBIACAAgAhmAEBAOABACEJAwAAgQIAIHkBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhlQFAAOIBACGWAQEA4AEAIZcBIACAAgAhmAEBAOABACEDAAAAAwAgGgAA8wIAIBsAAPwCACAOAAAAAwAgBQAAlwIAIAoAAJgCACATAAD8AgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIZ4BAQDgAQAhDAUAAJcCACAKAACYAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIZ4BAQDgAQAhAwAAABoAIBoAAPUCACAbAAD_AgAgEAAAABoAIAsAAL0CACANAAC_AgAgEwAA_wIAIHkBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKqASKQAQEA4AEAIaIBAQDgAQAhowEBAOABACGkAQEAugIAIaUBAQC6AgAhpgEBALoCACGoAQAAuwKoASKqASAAgAIAIQ4LAAC9AgAgDQAAvwIAIHkBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKqASKQAQEA4AEAIaIBAQDgAQAhowEBAOABACGkAQEAugIAIaUBAQC6AgAhpgEBALoCACGoAQAAuwKoASKqASAAgAIAIQ4LAADaAgAgDAAA2wIAIHkBAAAAAX9AAAAAAYABQAAAAAGOAQAAAKoBApABAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGlAQEAAAABpgEBAAAAAagBAAAAqAECqgEgAAAAAQIAAAABACAaAACAAwAgCwMAAPUBACAEAAD0AQAgBQAA9gEAIHkBAAAAAXsBAAAAAXwBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQKPAQEAAAABAgAAAAsAIBoAAIIDACADAAAAGgAgGgAAgAMAIBsAAIYDACAQAAAAGgAgCwAAvQIAIAwAAL4CACATAACGAwAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIY4BAAC8AqoBIpABAQDgAQAhogEBAOABACGjAQEA4AEAIaQBAQC6AgAhpQEBALoCACGmAQEAugIAIagBAAC7AqgBIqoBIACAAgAhDgsAAL0CACAMAAC-AgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIY4BAAC8AqoBIpABAQDgAQAhogEBAOABACGjAQEA4AEAIaQBAQC6AgAhpQEBALoCACGmAQEAugIAIagBAAC7AqgBIqoBIACAAgAhAwAAAAkAIBoAAIIDACAbAACJAwAgDQAAAAkAIAMAAOwBACAEAADrAQAgBQAA7QEAIBMAAIkDACB5AQDgAQAhewEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGMAUAA4gEAIY4BAADqAY4BIo8BAQDgAQAhCwMAAOwBACAEAADrAQAgBQAA7QEAIHkBAOABACF7AQDgAQAhfAEA4AEAIX9AAOIBACGAAUAA4gEAIYwBQADiAQAhjgEAAOoBjgEijwEBAOABACEECQAICwQCDBMEDRYFBAUIAwgQBAkABwoAAQMDAAIIDAQJAAYEAwACBAABBQADBw4FAgQAAQYABAEIDwACBREACBIAAgwXAA0YAAAAAAMJAA0gAA4hAA8AAAADCQANIAAOIQAPAQoAAQEKAAEFCQAUIAAXIQAYMgAVMwAWAAAAAAAFCQAUIAAXIQAYMgAVMwAWAQMAAgEDAAIDCQAdIAAeIQAfAAAAAwkAHSAAHiEAHwAAAAMJACUgACYhACcAAAADCQAlIAAmIQAnAwMAAgQAAQUAAwMDAAIEAAEFAAMDCQAsIAAtIQAuAAAAAwkALCAALSEALgIEAAEGAAQCBAABBgAEBQkAMyAANiEANzIANDMANQAAAAAABQkAMyAANiEANzIANDMANQ4CAQ8ZARAcAREdARIeARQgARUiCRYjChclARgnCRkoCxwpAR0qAR4rCSIuDCMvECQxAiUyAiY0Aic1Aig2Aik4Aio6CSs7ESw9Ai0_CS5AEi9BAjBCAjFDCTRGEzVHGTZIAzdJAzhKAzlLAzpMAztOAzxQCT1RGj5TAz9VCUBWG0FXA0JYA0NZCURcHEVdIEZfIUdgIUhjIUlkIUplIUtnIUxpCU1qIk5sIU9uCVBvI1FwIVJxIVNyCVR1JFV2KFZ3BFd4BFh5BFl6BFp7BFt9BFx_CV2AASleggEEX4QBCWCFASphhgEEYocBBGOIAQlkiwErZYwBL2aNAQVnjgEFaI8BBWmQAQVqkQEFa5MBBWyVAQltlgEwbpgBBW-aAQlwmwExcZwBBXKdAQVzngEJdKEBMnWiATg"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};
var Status = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/student/student.service.ts
var getProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      studentBookings: true,
      reviewsGiven: true
    }
  });
};
var updateProfile = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, profileAvatar: true }
  });
};
var changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect");
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { message: "Password updated successfully" };
};
var deleteAccount = async (userId) => {
  await prisma.user.delete({ where: { id: userId } });
  return { message: "Account deleted successfully" };
};
var getStudentStatsData = async (userId) => {
  console.log(userId);
  const [
    totalBooking,
    totalReview
  ] = await Promise.all([
    prisma.booking.count({ where: { studentId: userId } }),
    prisma.review.count({ where: { studentId: userId } })
  ]);
  return { totalBooking, totalReview };
};
var studentService = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getStudentStatsData
};

// src/utils/sendResponse.ts
var sendSuccess = (res, { statusCode = 200, message = "Success", data }) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
};
var sendError = (res, {
  statusCode = 500,
  message = "Something went wrong",
  errors
}) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }
  });
};

// src/modules/student/student.controller.ts
var getProfile2 = async (req, res, next) => {
  try {
    const user = await studentService.getProfile(req.user.userId);
    return sendSuccess(res, {
      statusCode: 200,
      message: "fetch profile successfully",
      data: user
    });
  } catch (err) {
    next(err);
  }
};
var updateProfile2 = async (req, res, next) => {
  try {
    const data = req.body;
    const updated = await studentService.updateProfile(req.user.userId, data);
    return sendSuccess(res, {
      statusCode: 200,
      message: " profile updated successfully",
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
var updateProfileAvatar = async (req, res, next) => {
  try {
    const data = req.body;
    console.log("data", data);
    return sendSuccess(res, {
      statusCode: 200,
      message: " profile avatar updated successfully",
      data: {
        profileAvatar: "https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
      }
    });
  } catch (err) {
    next(err);
  }
};
var changePassword2 = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await studentService.changePassword(req.user.userId, oldPassword, newPassword);
    return sendSuccess(res, {
      statusCode: 200,
      message: "password change successfully"
    });
  } catch (err) {
    next(err);
  }
};
var deleteAccount2 = async (req, res, next) => {
  try {
    await studentService.deleteAccount(req.user.userId);
    return sendSuccess(res, {
      statusCode: 200,
      message: "account delete successfully"
    });
  } catch (err) {
    next(err);
  }
};
var getStudentDashboardStats = async (req, res, next) => {
  try {
    const userId = req.params?.id;
    console.log("user", req.user);
    const stats = await studentService.getStudentStatsData(userId);
    return sendSuccess(res, {
      statusCode: 200,
      data: stats,
      message: "fetch dashboard stats successfully"
    });
  } catch (error) {
    next(error);
  }
};
var studentController = {
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  changePassword: changePassword2,
  deleteAccount: deleteAccount2,
  getStudentDashboardStats,
  updateProfileAvatar
};

// src/modules/upload/uploadImage.service.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// src/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import dotenv2 from "dotenv";

// src/config/env.ts
import dotenv from "dotenv";
import { z as z3 } from "zod";
dotenv.config();
var envSchema = z3.object({
  PORT: z3.coerce.number().default(5e3),
  DATABASE_URL: z3.string().url().or(z3.string().startsWith("postgresql://neondb_owner:npg_75ZGjUnMTBlQ@ep-mute-king-aiq1eati-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")),
  JWT_SECRET: z3.string(),
  CLOUDINARY_SECRET: z3.string(),
  CLOUDINARY_KEY: z3.string(),
  CLOUDINARY_NAME: z3.string()
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid or missing environment variables:\n", parsed.error.issues);
  console.error(parsed.error.format());
  process.exit(1);
}
var envConfig = parsed.data;

// src/config/cloudinary.config.ts
dotenv2.config();
cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_NAME,
  api_key: envConfig.CLOUDINARY_KEY,
  api_secret: envConfig.CLOUDINARY_SECRET,
  secure: true
});
var cloudinary_config_default = cloudinary;

// src/modules/upload/uploadImage.service.ts
var storage = new CloudinaryStorage({
  cloudinary: cloudinary_config_default,
  params: async (req, file) => {
    return {
      folder: "skill-bridge-asset",
      format: "webp",
      public_id: file.originalname.split(".")[0] + "-" + Date.now(),
      transformation: [{ width: 1024, height: 1024, crop: "limit" }]
    };
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WEBP allowed."));
    }
  }
});

// src/middlewares/validateRequest.ts
import { ZodError } from "zod";

// src/utils/formatZodError.ts
var formatZodError = (error) => {
  const formattedErrors = {};
  error.errors.forEach((err) => {
    const field = err.path[err.path.length - 1];
    formattedErrors[field] = err.message;
  });
  return formattedErrors;
};

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatZodError(error)
      });
    }
    next(error);
  }
};

// src/middlewares/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = envConfig.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
async function authMiddleware(req, res, next) {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;
    const token = cookieToken || headerToken;
    if (!token) {
      return res.status(401).json({ error: "Authentication token missing" });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.userId || !payload?.role) {
      return res.status(401).json({ error: "Invalid token payload" });
    }
    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }
    next();
  };
}

// src/modules/Auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import jwt2 from "jsonwebtoken";

// src/utils/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/modules/Auth/auth.service.ts
var JWT_SECRET2 = process.env.JWT_SECRET;
var registerUser = async (payload) => {
  const { name, email, password, role } = payload;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");
  const hashedPassword = await bcrypt2.hash(password, 10);
  let userRole = Role.STUDENT;
  if (role && role.toUpperCase() === "TUTOR") userRole = Role.TUTOR;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: userRole,
      status: Status.ACTIVE,
      emailVerified: false
    }
  });
  const token = jwt2.sign({ userId: user.id, role: user.role }, JWT_SECRET2, {
    expiresIn: "7d"
  });
  return { user, token };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new Error("Invalid credentials");
  }
  if (user.status === Status.SUSPENDED) {
    throw new Error("User is banned");
  }
  const isPasswordValid = await bcrypt2.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = jwt2.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET2,
    { expiresIn: "7d" }
  );
  const { password: _password, ...safeUser } = user;
  return {
    user: safeUser,
    token
  };
};
var getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phoneNumber: true,
      location: true,
      status: true,
      profileAvatar: true,
      studentBookings: true,
      reviewsGiven: true,
      tutorProfile: {
        select: {
          id: true,
          bio: true,
          categoryId: true,
          category: true,
          experience: true,
          hourlyRate: true,
          subjects: true,
          availability: true
        }
      }
    }
  });
  if (!user) throw new Error("User not found");
  return user;
};
var isUserExist = async (userId, model) => {
  switch (model) {
    case "USER":
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        throw new AppError("user not found");
      }
      break;
    case "TUTOR":
      const tutor = await prisma.tutorProfile.findUnique({
        where: { id: userId }
      });
      if (!tutor) {
        throw new AppError("tutor profile not found");
      }
    default:
      return null;
  }
};
var authServices = {
  registerUser,
  loginUser,
  getCurrentUser,
  isUserExist
};

// src/modules/Auth/auth.controller.ts
var registerUser2 = async (req, res) => {
  try {
    console.log(req.body);
    const { user, token } = await authServices.registerUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var loginUser2 = async (req, res) => {
  try {
    const { user, token } = await authServices.loginUser(req.body);
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/"
    });
    res.status(200).json({
      message: "Login successful",
      user,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });
    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var meUser = async (req, res) => {
  try {
    const user = await authServices.getCurrentUser(req.user.userId);
    return sendSuccess(res, {
      data: user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var handleAvatarChange = async (req, res, next) => {
  try {
    const userid = req.user?.userId;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const result = req.file;
    await prisma.user.update({
      where: {
        id: userid
      },
      data: {
        profileAvatar: result.path
      }
    });
    return sendSuccess(res, {
      message: "your Profile Avatar Upload successfully",
      data: {
        profileAvatar: result.path
      }
    });
  } catch (error) {
    next(error);
  }
};
var AuthControllers = {
  //* Add controller methods here
  registerUser: registerUser2,
  loginUser: loginUser2,
  logoutUser,
  meUser,
  handleAvatarChange
};

// src/modules/Auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(authSchemas.registerUserSchema), AuthControllers.registerUser);
router.post("/login", validateRequest(authSchemas.loginSchema), AuthControllers.loginUser);
router.get("/me", authMiddleware, AuthControllers.meUser);
router.put("/profile/change-avatar", authMiddleware, roleMiddleware(["STUDENT", "TUTOR"]), upload.single("file"), AuthControllers.handleAvatarChange);
router.post("/logout", authMiddleware, AuthControllers.logoutUser);
router.put("/change-password", authMiddleware, roleMiddleware(["STUDENT", "TUTOR"]), validateRequest(studentSchemas.changePasswordSchema), studentController.changePassword);
router.delete("/delete-account", authMiddleware, roleMiddleware(["STUDENT", "TUTOR"]), studentController.deleteAccount);
var AuthRoutes = router;

// src/modules/tutor/tutor.route.ts
import { Router as Router2 } from "express";

// src/modules/tutor/tutor.service.ts
var createTutorProfile = async (userId, payload) => {
  const existing = await prisma.tutorProfile.findUnique({ where: { userId } });
  if (existing) throw new Error("Tutor profile already exists");
  const profile = await prisma.tutorProfile.create({
    data: {
      userId,
      bio: payload.bio,
      subjects: payload.subjects,
      hourlyRate: payload.hourlyRate,
      categoryId: payload.categoryId,
      category: payload.category,
      experience: payload.experience
    }
  });
  return profile;
};
var updateTutorProfile = async (userId, payload) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new Error("Tutor profile not found");
  }
  const { user, ...tutorData } = payload;
  console.log("payload", payload);
  if (!user) {
    throw new Error("User update data is required");
  }
  const [tutorProfile, userData] = await Promise.all([
    prisma.tutorProfile.update({
      where: { userId },
      data: tutorData
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        location: user.location
      }
    })
  ]);
  return {
    tutorProfile,
    user: userData
  };
};
var getTutorProfile = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId },
    include: { user: true }
  });
  if (!profile) throw new Error("Tutor profile not found");
  return profile;
};
var getTutorSessions = async (userId) => {
  const profile = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!profile) throw new Error("Tutor profile not found");
  return prisma.booking.findMany({
    where: {
      tutorId: profile.id
    },
    orderBy: {
      dateTime: "desc"
    },
    select: {
      id: true,
      status: true,
      dateTime: true,
      createdAt: true,
      student: {
        select: {
          profileAvatar: true,
          name: true
        }
      },
      availability: {
        select: {
          date: true,
          startTime: true,
          endTime: true
        }
      },
      tutor: {
        select: {
          hourlyRate: true,
          subjects: true,
          category: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              profileAvatar: true
            }
          }
        }
      },
      review: {
        select: {
          rating: true,
          comment: true
        }
      }
    }
  });
};
var addAvailabilityService = async (userId, payload) => {
  const { date, startTime, endTime } = payload;
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId }
  });
  if (!tutor) {
    throw { statusCode: 404, message: "Tutor profile not found" };
  }
  const overlap = await prisma.availability.findFirst({
    where: {
      tutorId: tutor.id,
      date: new Date(date),
      OR: [
        {
          startTime: { lt: endTime },
          endTime: { gt: startTime }
        }
      ]
    }
  });
  if (overlap) {
    throw { statusCode: 409, message: "Time slot overlaps existing slot" };
  }
  return prisma.availability.create({
    data: {
      tutorId: tutor.id,
      date: new Date(date),
      startTime,
      endTime
    }
  });
};
var getAvailability = async (tutorUserId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: tutorUserId }
  });
  if (!tutor) {
    throw { statusCode: 404, message: "Tutor not found" };
  }
  return prisma.availability.findMany({
    where: {
      tutorId: tutor.id
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }]
  });
};
var getAllAvailability = async (tutorUserId) => {
  const slots = await prisma.availability.findMany({
    where: { tutorId: tutorUserId }
  });
  return slots;
};
var deleteAvailability = async (tutorUserId, availabilityId) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId: tutorUserId }
  });
  if (!tutor) {
    throw { statusCode: 404, message: "Tutor not found" };
  }
  const slot = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!slot || slot.tutorId !== tutor.id) {
    throw { statusCode: 403, message: "Unauthorized" };
  }
  if (slot.isBooked) {
    throw {
      statusCode: 400,
      message: "Cannot delete booked availability"
    };
  }
  await prisma.availability.delete({
    where: { id: availabilityId }
  });
};
var markedSessionFinish = async (userId, bookingId, status) => {
  await authServices.isUserExist(userId, "TUTOR");
  const isBookingExist = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!isBookingExist) {
    throw new AppError("Booking not found");
  }
  const updatedData = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: status === "COMPLETED" ? "COMPLETED" : "CANCELLED"
    }
  });
  return updatedData;
};
var getAllTutors = async (filters) => {
  const { category, q, rating, minPrice, maxPrice, subject } = filters;
  const tutorProfileFilter = {};
  if (category) tutorProfileFilter.categoryId = category;
  if (subject) tutorProfileFilter.subjects = { has: subject };
  if (minPrice || maxPrice) {
    tutorProfileFilter.hourlyRate = {
      ...minPrice && { gte: Number(minPrice) },
      ...maxPrice && { lte: Number(maxPrice) }
    };
  }
  const userWhere = {
    role: "TUTOR",
    status: "ACTIVE",
    tutorProfile: { isNot: null, is: tutorProfileFilter }
  };
  if (q) {
    userWhere.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { tutorProfile: { is: { subjects: { has: q } } } }
    ];
  }
  const tutors = await prisma.user.findMany({
    where: userWhere,
    select: {
      id: true,
      name: true,
      email: true,
      profileAvatar: true,
      role: true,
      status: true,
      createdAt: true,
      tutorProfile: {
        select: {
          id: true,
          hourlyRate: true,
          subjects: true,
          category: true
        }
      }
    }
  });
  const tutorProfileIds = tutors.map((t) => t.tutorProfile?.id).filter(Boolean);
  const ratings = await prisma.review.groupBy({
    by: ["tutorId"],
    where: {
      tutorId: { in: tutorProfileIds }
    },
    _avg: {
      rating: true
    }
  });
  const ratingsMap = {};
  ratings.forEach((r) => {
    if (r._avg?.rating != null) {
      ratingsMap[r.tutorId] = r._avg.rating;
    }
  });
  const tutorsWithAvgRating = tutors.map((t) => {
    const avg = t.tutorProfile ? ratingsMap[t.tutorProfile.id] ?? 0 : 0;
    return {
      ...t,
      avgRating: Number(avg.toFixed(1))
    };
  }).filter((t) => {
    if (!rating) return true;
    return t.avgRating >= Number(rating);
  });
  return tutorsWithAvgRating;
};
var getTutorProfilePublic = async (tutorUserId) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutorUserId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      },
      availability: true
    }
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }
  const reviews = await prisma.review.findMany({
    where: { tutorId: tutorProfile.id },
    include: {
      student: {
        select: {
          id: true,
          name: true
        }
      },
      booking: {
        select: {
          id: true,
          dateTime: true
        }
      }
    }
  });
  return {
    tutor: tutorProfile,
    reviews
  };
};
var tutorDashboardData = async (tutorId) => {
  const tutorData = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
    include: {
      user: { select: { name: true } },
      availability: {
        where: { isBooked: false },
        orderBy: { date: "asc" },
        take: 5
      },
      bookings: {
        where: { status: "CONFIRMED" },
        include: {
          student: {
            select: { name: true, profileAvatar: true }
          }
        },
        orderBy: { dateTime: "asc" },
        take: 5
      }
    }
  });
  const stats = await prisma.$transaction([
    prisma.booking.count({
      where: { tutorId, status: "COMPLETED" }
    }),
    prisma.review.aggregate({
      where: { tutorId },
      _avg: { rating: true },
      _count: { id: true }
    }),
    prisma.review.findMany({
      where: { tutorId },
      orderBy: { createdAt: "desc" },
      take: 1,
      include: { student: { select: { name: true } } }
    })
  ]);
  return {
    tutorData,
    totalSessions: stats[0],
    ratingData: stats[1],
    recentReview: stats[2][0]
  };
};
var tutorServices = {
  getTutorProfile,
  createTutorProfile,
  updateTutorProfile,
  getTutorSessions,
  addAvailabilityService,
  markedSessionFinish,
  getAllTutors,
  getTutorProfilePublic,
  getAvailability,
  deleteAvailability,
  tutorDashboardData,
  getAllAvailability
};

// src/modules/tutor/tutor.controller.ts
var createProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const profile = await tutorServices.createTutorProfile(userId, req.body);
    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var updateProfile3 = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const profile = await tutorServices.updateTutorProfile(userId, req.body);
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var getProfile3 = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const profile = await tutorServices.getTutorProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var getTutorSessions2 = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const sessions = await tutorServices.getTutorSessions(userId);
    res.status(200).json({
      message: "session fetch successfully",
      data: sessions
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var getAvailability2 = async (req, res) => {
  try {
    const tutorUserId = req.user?.userId;
    const result = await tutorServices.getAvailability(tutorUserId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var getAllAvailabilities = async (req, res) => {
  try {
    const tutorUserId = req.user?.userId;
    const result = await tutorServices.getAllAvailability(tutorUserId);
    console.log(result);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var addAvailabilityController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const updatedData = await tutorServices.addAvailabilityService(userId, req.body);
    res.status(200).json({
      message: "added availability successfully",
      data: updatedData
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var deleteAvailability2 = async (req, res) => {
  try {
    const tutorUserId = req.user?.userId;
    const availabilityId = req.params.id;
    await tutorServices.deleteAvailability(tutorUserId, availabilityId);
    res.status(200).json({
      success: true,
      message: "Availability removed"
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};
var markedSessionFinishController = async (req, res, next) => {
  try {
    const { tutorId, status } = req.body;
    const sessionId = req.params.sessionId;
    const updateSession = await tutorServices.markedSessionFinish(tutorId, sessionId, status);
    sendSuccess(res, {
      message: "session marked successfully",
      data: updateSession
    });
  } catch (error) {
    next(error);
  }
};
var gettingAllTutorsLists = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      q: req.query.q,
      maxPrice: req.query.maxPrice,
      minPrice: req.query.minPrice,
      rating: req.query.rating,
      subject: req.query.subject
    };
    const allTutors = await tutorServices.getAllTutors(filters);
    return res.status(200).json({
      success: true,
      message: "Fetch tutors successfully",
      data: allTutors
    });
  } catch (error) {
    next(error);
  }
};
var getTutorProfileDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const sessions = await tutorServices.getTutorProfilePublic(userId);
    res.status(200).json({
      message: "tutor profile fetch successfully",
      data: sessions
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var getTutorDashboard = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      include: { tutorProfile: true }
    });
    if (!user) {
      return sendError(res, {
        message: "User Not found"
      });
    }
    const tutorId = user.tutorProfile?.id;
    const dashboardData = await tutorServices.tutorDashboardData(tutorId);
    if (!dashboardData.tutorData) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found!"
      });
    }
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        profile: {
          name: dashboardData.tutorData.user.name,
          totalSessions: dashboardData.totalSessions,
          avgRating: dashboardData.ratingData._avg.rating || 0,
          totalReviews: dashboardData.ratingData._count.id
        },
        upcomingSessions: dashboardData.tutorData.bookings,
        availability: dashboardData.tutorData.availability,
        recentFeedback: dashboardData.recentReview ? {
          comment: dashboardData.recentReview.comment,
          studentName: dashboardData.recentReview.student.name
        } : null
      }
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
var tutorControllers = {
  createProfile,
  updateProfile: updateProfile3,
  getProfile: getProfile3,
  getTutorSessions: getTutorSessions2,
  addAvailabilityController,
  markedSessionFinishController,
  gettingAllTutorsLists,
  deleteAvailability: deleteAvailability2,
  getAvailability: getAvailability2,
  getTutorProfileDetails,
  getAllAvailabilities,
  getTutorDashboard
};

// src/modules/tutor/tutor.schema.ts
import { z as z4 } from "zod";
var createTutorProfileSchema = z4.object({
  body: z4.object({
    bio: z4.string({
      required_error: "Bio is required"
    }).min(10, "Bio must be at least 10 characters long"),
    hourlyRate: z4.number({
      required_error: "Hourly rate is required",
      invalid_type_error: "Hourly rate must be a number"
    }).positive("Hourly rate must be a positive number"),
    category: z4.string({
      required_error: "Category is required"
    }).min(2, "Category must be at least 2 characters long"),
    subjects: z4.array(
      z4.string().min(2, "Each subject must be at least 2 characters long")
    ).min(1, "At least one subject is required")
  })
});
var addAvailabilitySchema = z4.object({
  body: z4.object({
    date: z4.string({
      required_error: "Date is required"
    }).refine((val) => {
      const inputDate = new Date(val);
      const today = /* @__PURE__ */ new Date();
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }, {
      message: "Date must be today or a future date"
    }),
    startTime: z4.string(),
    endTime: z4.string()
  })
});
var tutorSchemas = {
  createTutorProfileSchema,
  addAvailabilitySchema
};

// src/modules/tutor/tutor.route.ts
var router2 = Router2();
var tutorsRouterPublic = Router2();
router2.post(
  "/profile",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  validateRequest(tutorSchemas.createTutorProfileSchema),
  tutorControllers.createProfile
);
router2.put(
  "/profile",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.updateProfile
);
router2.get(
  "/sessions",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getTutorSessions
);
router2.get(
  "/dashboard-data/:tutorId",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getTutorDashboard
);
router2.put(
  "/sessions/:sessionId/finish-session",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.markedSessionFinishController
);
router2.put(
  "/availability",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  validateRequest(tutorSchemas.addAvailabilitySchema),
  tutorControllers.addAvailabilityController
);
router2.get(
  "/availability",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getAllAvailabilities
);
router2.get(
  "/get-dashboard-data",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.getTutorDashboard
);
router2.delete(
  "/availability/:id",
  authMiddleware,
  roleMiddleware(["TUTOR"]),
  tutorControllers.deleteAvailability
);
tutorsRouterPublic.get("/", tutorControllers.gettingAllTutorsLists);
tutorsRouterPublic.get("/:id", tutorControllers.getTutorProfileDetails);
var TutorRoutes = router2;

// src/config/cors.ts
var corsConfig = {
  origin: ["http://localhost:5000", "https://skillbridgeclient-pied.vercel.app", "https://skillbridgeclient-mainu0177-mainuddins-projects-943a859f.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
};

// src/middlewares/notFound.ts
var notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

// src/middlewares/errorHandler.ts
var errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err.stack || err);
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: { message: err.message || "Internal Server Error" },
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true
  }
});

// src/modules/student/student.route.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/profile", authMiddleware, roleMiddleware(["STUDENT"]), studentController.getProfile);
router3.put("/profile", authMiddleware, roleMiddleware(["STUDENT"]), studentController.updateProfile);
router3.post("/profile/avatar-change", authMiddleware, roleMiddleware(["STUDENT"]), studentController.updateProfile);
router3.get("/:id/dashboard/stats", authMiddleware, roleMiddleware(["STUDENT"]), studentController.getStudentDashboardStats);
var student_route_default = router3;

// src/modules/booking/booking.route.ts
import { Router as Router4 } from "express";

// src/modules/booking/booking.schema.ts
import { z as z5 } from "zod";
var bookingCreateSchema = z5.object({
  body: z5.object({
    tutorId: z5.string({
      required_error: "Tutor ID is required"
    }).uuid("Invalid tutor ID"),
    availabilityId: z5.string({
      required_error: "availabilityId  is required"
    }).uuid("Invalid availabilityId ")
  })
});
var bookingSchemas = { bookingCreateSchema };

// src/modules/booking/booking.service.ts
var createBooking = async (studentId, payload) => {
  const { tutorId, availabilityId } = payload;
  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!availability) {
    throw new AppError(
      "Availability slot not found"
    );
  }
  if (availability.isBooked) {
    throw new AppError(
      "This slot is already booked"
    );
  }
  if (availability.tutorId !== tutorId) {
    throw new AppError(
      "Tutor mismatch with availability"
    );
  }
  const newBooking = await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      dateTime: availability.date,
      status: "CONFIRMED",
      availabilityId: payload.availabilityId
    }
  });
  await prisma.availability.update({
    where: { id: availability.id },
    data: { isBooked: true }
  });
  return newBooking;
};
var getAllBookings = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: { studentId: userId },
    include: {
      review: true
    },
    orderBy: { dateTime: "asc" }
  });
  const tutorIds = [...new Set(bookings.map((b) => b.tutorId))];
  const tutors = await prisma.tutorProfile.findMany({
    where: {
      id: { in: tutorIds }
    },
    include: {
      user: true
    }
  });
  const bookingsWithTutor = bookings.map((b) => ({
    ...b,
    tutor: tutors.find((t) => t.id === b.tutorId) || null
  }));
  return bookingsWithTutor;
};
var getBookingDetails = async (bookingId) => {
  const bookingDetails = await prisma.booking.findUnique({
    where: {
      id: bookingId
    },
    include: {
      student: true,
      review: {
        include: {
          student: true
        }
      },
      availability: {
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  profileAvatar: true,
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!bookingDetails) return null;
  return {
    ...bookingDetails,
    tutorProfile: bookingDetails.availability?.tutor || null
  };
};
var cancelBooking = async (userId, bookingId, status) => {
  await authServices.isUserExist(userId, "USER");
  console.log("bookingId", bookingId);
  const isBookingExist = await prisma.booking.findUnique({
    where: {
      id: bookingId
    }
  });
  if (!isBookingExist) {
    throw new AppError("Booking not found");
  }
  const booking = await prisma.booking.update({
    where: {
      id: bookingId
    },
    data: {
      status: "CANCELLED"
    }
  });
  await prisma.availability.update({
    where: {
      id: booking.availabilityId
    },
    data: {
      isBooked: false
    }
  });
  return booking;
};
var bookingServices = {
  createBooking,
  getBookingDetails,
  getAllBookings,
  cancelBooking
};

// src/modules/booking/booking.controller.ts
var createBooking2 = async (req, res, next) => {
  try {
    const studentId = req.user?.userId;
    const booking = await bookingServices.createBooking(studentId, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: "booking created successfully",
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
var getAllBookings2 = async (req, res, next) => {
  try {
    const studentId = req.user?.userId;
    const bookings = await bookingServices.getAllBookings(studentId);
    return sendSuccess(res, {
      statusCode: 200,
      message: "your bookings fetch successfully",
      data: bookings || []
    });
  } catch (error) {
    next(error);
  }
};
var getBookingsDetails = async (req, res, next) => {
  try {
    const bookingId = req.params.id;
    const booking = await bookingServices.getBookingDetails(bookingId);
    return sendSuccess(res, {
      statusCode: 200,
      message: "your bookings fetch successfully",
      data: booking || {}
    });
  } catch (error) {
    next(error);
  }
};
var cancelBooking2 = async (req, res, next) => {
  try {
    const { status } = req.body;
    const sessionId = req.params.id;
    const studentId = req.user?.userId;
    const updateSession = await bookingServices.cancelBooking(studentId, sessionId, status);
    sendSuccess(res, {
      message: "session cancel successfully",
      data: updateSession
    });
  } catch (error) {
    next(error);
  }
};
var bookingControllers = {
  createBooking: createBooking2,
  getBookingsDetails,
  getAllBookings: getAllBookings2,
  cancelBooking: cancelBooking2
};

// src/modules/booking/booking.route.ts
var router4 = Router4();
router4.post("/", authMiddleware, roleMiddleware(["STUDENT"]), validateRequest(bookingSchemas.bookingCreateSchema), bookingControllers.createBooking);
router4.get("/", authMiddleware, roleMiddleware(["STUDENT"]), bookingControllers.getAllBookings);
router4.get("/:id", authMiddleware, roleMiddleware(["STUDENT"]), bookingControllers.getBookingsDetails);
router4.patch("/:id/cancel-booking", authMiddleware, roleMiddleware(["STUDENT"]), bookingControllers.cancelBooking);
var booking_route_default = router4;

// src/modules/shared/shared.route.ts
import { Router as Router5 } from "express";

// src/modules/shared/shared.service.ts
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({});
  return categories;
};
var getKPISData = async () => {
  const [
    totalTutors,
    totalStudent,
    activeTutors,
    tutorSubjects,
    totalBookings,
    completedBookings,
    usersWithLocation
  ] = await Promise.all([
    prisma.tutorProfile.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.tutorProfile.count({
      where: {
        availability: {
          some: {
            isBooked: false,
            date: { gte: /* @__PURE__ */ new Date() }
          }
        }
      }
    }),
    prisma.tutorProfile.findMany({ select: { subjects: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.user.findMany({
      where: { location: { not: null } },
      select: { location: true }
    })
  ]);
  const totalSubjects = new Set(tutorSubjects.flatMap((t) => t.subjects)).size;
  const totalCountries = new Set(usersWithLocation.map((u) => u.location)).size;
  const successRate = totalBookings === 0 ? 0 : Math.round(completedBookings / totalBookings * 100);
  return {
    totalTutors,
    totalStudent,
    activeTutors,
    totalSubjects,
    successRate,
    totalCountries
  };
};
var sharedServices = {
  getAllCategories,
  getKPISData
};

// src/modules/shared/shared.controller.ts
var getAllCategories2 = async (req, res, next) => {
  try {
    const categories = await sharedServices.getAllCategories();
    return sendSuccess(res, {
      statusCode: 200,
      message: "fetch all categories successfully",
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
var getKPIsData = async (req, res, next) => {
  try {
    const kpisData = await sharedServices.getKPISData();
    return sendSuccess(res, {
      statusCode: 200,
      message: "fetch kpis report successfully",
      data: kpisData
    });
  } catch (error) {
    next(error);
  }
};
var sharedControllers = {
  getAllCategories: getAllCategories2,
  getKPIsData
};

// src/modules/shared/shared.route.ts
var router5 = Router5();
router5.get("/categories", sharedControllers.getAllCategories);
router5.get("/get-kpis-data", sharedControllers.getKPIsData);
var shared_route_default = router5;

// src/modules/admin/admin.route.ts
import { Router as Router6 } from "express";

// src/modules/admin/admin.service.ts
import { startOfMonth, endOfMonth } from "date-fns";
var getProfile4 = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId }
  });
};
var getAllUsers = async () => {
  console.log("services");
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    },
    where: {
      role: {
        in: ["STUDENT", "TUTOR"]
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getAllBookings3 = async () => {
  return await prisma.booking.findMany({
    include: {
      student: true,
      availability: true,
      review: true,
      tutor: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateUserStatus = async (userId, status) => {
  console.log(status);
  return await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, name: true, email: true, status: true }
  });
};
var createCategory = async (payload) => {
  const newCategory = await prisma.category.create({
    data: payload
  });
  return newCategory;
};
var deleteCategory = async (categoryId) => {
  const newCategory = await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
  return newCategory;
};
var updateCategory = async (payload) => {
  const newCategory = await prisma.category.update({
    where: {
      id: payload.categoryId
    },
    data: {
      name: payload.name,
      subjects: payload.subjects
    }
  });
  return newCategory;
};
async function getDashboardData() {
  const [
    activeTutors,
    activeStudents,
    totalBookings,
    completedBookingsCount,
    completedBookings
  ] = await Promise.all([
    // Active Tutors
    prisma.user.count({
      where: {
        role: "TUTOR",
        status: "ACTIVE",
        tutorProfile: {
          bookings: {
            some: {
              status: {
                in: ["CONFIRMED", "COMPLETED"]
              }
            }
          }
        }
      }
    }),
    // Active Students
    prisma.user.count({
      where: {
        role: "STUDENT",
        status: "ACTIVE",
        studentBookings: {
          some: {}
        }
      }
    }),
    // Total bookings
    prisma.booking.count(),
    // Completed bookings count
    prisma.booking.count({
      where: {
        status: "COMPLETED"
      }
    }),
    // Completed bookings with tutor rate (for revenue)
    prisma.booking.findMany({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth(/* @__PURE__ */ new Date()),
          lte: endOfMonth(/* @__PURE__ */ new Date())
        }
      },
      select: {
        tutor: {
          select: {
            hourlyRate: true
          }
        }
      }
    })
  ]);
  const monthlyRevenue = completedBookings.reduce(
    (sum, booking) => sum + booking.tutor.hourlyRate,
    0
  );
  const bookingRate = totalBookings === 0 ? 0 : Number(
    (completedBookingsCount / totalBookings * 100).toFixed(2)
  );
  return {
    activeTutors,
    activeStudents,
    monthlyRevenue,
    bookingRate
  };
}
var adminServices = {
  getProfile: getProfile4,
  getAllUsers,
  updateUserStatus,
  getAllBookings: getAllBookings3,
  createCategory,
  updateCategory,
  deleteCategory,
  getDashboardData
};

// src/modules/admin/admin.controller.ts
var getProfile5 = async (req, res, next) => {
  try {
    const user = await adminServices.getProfile(req.user.userId);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Profile fetched successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};
var getAllUsers2 = async (req, res, next) => {
  try {
    console.log("main user", req.user);
    const users = await adminServices.getAllUsers();
    return sendSuccess(res, {
      statusCode: 200,
      message: "All users fetched successfully",
      data: users
    });
  } catch (error) {
    next(error);
  }
};
var updateUserStatus2 = async (req, res, next) => {
  try {
    const { status } = req.body;
    console.log(req.body);
    const user = await adminServices.updateUserStatus(req.params.id, status);
    return sendSuccess(res, {
      statusCode: 200,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};
var getAllBookings4 = async (req, res, next) => {
  try {
    const user = await adminServices.getAllBookings();
    return sendSuccess(res, {
      statusCode: 200,
      message: "bookings fetch successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};
var createNewCategory = async (req, res, next) => {
  try {
    const newCategory = await adminServices.createCategory(req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "bookings fetch successfully",
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};
var updateCategory2 = async (req, res, next) => {
  try {
    const { name, subjects } = req.body;
    const categoryId = req.params.categoryId;
    const updatedCategory = await adminServices.updateCategory({
      name,
      subjects,
      categoryId: String(categoryId)
    });
    return sendSuccess(res, {
      statusCode: 200,
      message: "category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const newCategory = await adminServices.deleteCategory(String(categoryId));
    return sendSuccess(res, {
      statusCode: 200,
      message: "category delete successfully",
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};
var getDashboardData2 = async (req, res, next) => {
  try {
    const data = await adminServices.getDashboardData();
    return sendSuccess(res, {
      statusCode: 200,
      message: "category delete successfully",
      data
    });
  } catch (error) {
    next(error);
  }
};
var adminControllers = {
  getProfile: getProfile5,
  getAllBookings: getAllBookings4,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  createNewCategory,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getDashboardData: getDashboardData2
};

// src/modules/admin/admin.schemas.ts
import z6 from "zod";
var createCategorySchema = z6.object({
  body: z6.object({
    name: z6.string({
      required_error: "Category name is required"
    }),
    subjects: z6.array(z6.string()).min(1, "Subjects array must contain at least 1 items")
  })
});
var adminSchemas = { createCategorySchema };

// src/modules/admin/admin.route.ts
var router6 = Router6();
router6.use(authMiddleware, roleMiddleware(["ADMIN"]));
router6.get("/profile", adminControllers.getProfile);
router6.get("/users", adminControllers.getAllUsers);
router6.get("/bookings", adminControllers.getAllBookings);
router6.post("/categories", validateRequest(adminSchemas.createCategorySchema), adminControllers.createNewCategory);
router6.delete("/categories/:categoryId", adminControllers.deleteCategory);
router6.patch("/categories/:categoryId", adminControllers.updateCategory);
router6.get("/bookings", adminControllers.getAllBookings);
router6.get("/get-dashboard-data", adminControllers.getDashboardData);
router6.patch("/users/:id/status", adminControllers.updateUserStatus);
var admin_route_default = router6;

// src/modules/review/review.route.ts
import { Router as Router7 } from "express";

// src/modules/review/review.schema.ts
import { z as z7 } from "zod";
var createReviewSchema = z7.object({
  body: z7.object({
    bookingId: z7.string().uuid("Invalid booking ID"),
    tutorId: z7.string().uuid("Invalid tutor ID"),
    studentId: z7.string().uuid("Invalid student ID"),
    rating: z7.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
    comment: z7.string().min(2, "you must be provide a comment text")
  })
});
var reviewSchemas = { createReviewSchema };

// src/modules/review/review.service.ts
var createReview = async (payload) => {
  const booking = await prisma.booking.findUnique({
    where: { id: payload.bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("Cannot leave review before session is completed");
  }
  const existingReview = await prisma.review.findUnique({
    where: { bookingId: payload.bookingId }
  });
  if (existingReview) {
    throw new Error("Review for this booking already exists");
  }
  const review = await prisma.review.create({
    data: {
      bookingId: payload.bookingId,
      studentId: payload.studentId,
      tutorId: payload.tutorId,
      rating: payload.rating,
      comment: payload.comment
    }
  });
  return review;
};
var getAllReview = async (tutorId) => {
  const reviews = await prisma.review.findMany({
    where: {
      tutorId
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          profileAvatar: true
        }
      },
      booking: {
        select: {
          dateTime: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var reviewsServices = { createReview, getAllReview };

// src/modules/review/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const studentId = req.user?.userId;
    const newReview = await reviewsServices.createReview({ ...req.body, studentId });
    return sendSuccess(res, {
      statusCode: 201,
      message: "your Review Created successfully",
      data: newReview
    });
  } catch (error) {
    next(error);
  }
};
var getAllReview2 = async (req, res, next) => {
  try {
    const tutorId = req.params.tutorId;
    console.log("tutorId", tutorId);
    const allReviewByTutorId = await reviewsServices.getAllReview(tutorId);
    return sendSuccess(res, {
      statusCode: 201,
      message: "your Review fetch successfully",
      data: allReviewByTutorId
    });
  } catch (error) {
    next(error);
  }
};
var reviewControllers = { createReview: createReview2, getAllReview: getAllReview2 };

// src/modules/review/review.route.ts
var router7 = Router7();
router7.post("/", authMiddleware, roleMiddleware(["STUDENT"]), validateRequest(reviewSchemas.createReviewSchema), reviewControllers.createReview);
router7.get("/:tutorId", authMiddleware, roleMiddleware(["TUTOR"]), reviewControllers.getAllReview);
var review_route_default = router7;

// src/app.ts
var app = express();
app.all("/api/auth/*splat", toNodeHandler(auth));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(cors(corsConfig));
app.use("/api/auth", AuthRoutes);
app.use("/api/tutor", TutorRoutes);
app.use("/api/review", review_route_default);
app.use("/api/tutors", tutorsRouterPublic);
app.use("/api/booking", booking_route_default);
app.use("/api/student", student_route_default);
app.use("/api/admin", admin_route_default);
app.use("/api/shared", shared_route_default);
app.get("/welcome-page", (req, res) => {
  res.send("welcome to our my app");
});
app.get("/check-time", (req, res) => {
  res.json({
    serverTime: (/* @__PURE__ */ new Date()).toISOString(),
    localTime: (/* @__PURE__ */ new Date()).toLocaleString()
  });
});
app.get("/", (req, res) => {
  res.send("Hello Mainuddin Khan!");
});
app.use(notFound);
app.use(errorHandler);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
//# sourceMappingURL=index.js.map