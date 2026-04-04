// src/app.ts
import express2 from "express";
import cors2 from "cors";
import cookieParser2 from "cookie-parser";

// src/modules/Auth/auth.route.ts
import express from "express";

// src/modules/Auth/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.4.1",
  "engineVersion": "55ae170b1ced7fc6ed07a15f110549408c501bb3",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum Status {\n  ACTIVE\n  SUSPENDED\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nmodel User {\n  id            String  @id @default(uuid())\n  name          String\n  email         String  @unique\n  password      String\n  location      String?\n  profileAvatar String?\n  role          Role\n  status        Status  @default(ACTIVE)\n  emailVerified Boolean\n\n  //* Relations\n\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  reviewsGiven    Review[]      @relation("StudentReviews")\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel TutorProfile {\n  id           String         @id @default(ulid())\n  userId       String         @unique\n  bio          String\n  hourlyRate   Int\n  experience   String\n  availability Availability[]\n\n  user User @relation(fields: [userId], references: [id])\n\n  subjects   String[]\n  booking    Booking[]\n  categoryId String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Availability {\n  id        String       @id @default(uuid())\n  tutorId   String\n  tutor     TutorProfile @relation(fields: [tutorId], references: [id])\n  date      DateTime\n  bookings  Booking[]\n  startTime String\n  isBooked  Boolean      @default(false)\n  endTime   String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Category {\n  id       String   @id @default(uuid())\n  name     String   @unique\n  subjects String[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Booking {\n  id             String        @id @default(uuid())\n  studentId      String\n  tutorId        String\n  dateTime       DateTime\n  status         BookingStatus @default(CONFIRMED)\n  availabilityId String\n\n  //* Relation\n  student User @relation("StudentBookings", fields: [studentId], references: [id])\n\n  tutor TutorProfile @relation(fields: [tutorId], references: [id])\n\n  availability Availability @relation(fields: [availabilityId], references: [id])\n\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Review {\n  id        String @id @default(uuid())\n  bookingId String @unique\n  studentId String\n  tutorId   String\n\n  rating  Int\n  comment String\n\n  //* Relation\n  booking Booking @relation(fields: [bookingId], references: [id])\n  student User    @relation("StudentReviews", fields: [studentId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"profileAvatar","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviewsGiven","kind":"object","type":"Review","relationName":"StudentReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"experience","kind":"scalar","type":"String"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"bookings","kind":"object","type":"Booking","relationName":"AvailabilityToBooking"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"subjects","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"dateTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"availabilityId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToBooking"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"StudentReviews"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","tutor","student","availability","booking","review","bookings","_count","user","tutorProfile","studentBookings","reviewsGiven","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","TutorProfile.findUnique","TutorProfile.findUniqueOrThrow","TutorProfile.findFirst","TutorProfile.findFirstOrThrow","TutorProfile.findMany","TutorProfile.createOne","TutorProfile.createMany","TutorProfile.createManyAndReturn","TutorProfile.updateOne","TutorProfile.updateMany","TutorProfile.updateManyAndReturn","TutorProfile.upsertOne","TutorProfile.deleteOne","TutorProfile.deleteMany","_avg","_sum","TutorProfile.groupBy","TutorProfile.aggregate","Availability.findUnique","Availability.findUniqueOrThrow","Availability.findFirst","Availability.findFirstOrThrow","Availability.findMany","Availability.createOne","Availability.createMany","Availability.createManyAndReturn","Availability.updateOne","Availability.updateMany","Availability.updateManyAndReturn","Availability.upsertOne","Availability.deleteOne","Availability.deleteMany","Availability.groupBy","Availability.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Booking.findUnique","Booking.findUniqueOrThrow","Booking.findFirst","Booking.findFirstOrThrow","Booking.findMany","Booking.createOne","Booking.createMany","Booking.createManyAndReturn","Booking.updateOne","Booking.updateMany","Booking.updateManyAndReturn","Booking.upsertOne","Booking.deleteOne","Booking.deleteMany","Booking.groupBy","Booking.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","bookingId","studentId","tutorId","rating","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","dateTime","BookingStatus","status","availabilityId","name","subjects","has","hasEvery","hasSome","date","startTime","isBooked","endTime","userId","bio","hourlyRate","experience","categoryId","every","some","none","email","password","location","profileAvatar","Role","role","Status","emailVerified","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "iQM4YBELAADRAQAgDAAAwAEAIA0AANIBACB2AADMAQAwdwAAGgAQeAAAzAEAMHkBAAAAAX9AALYBACGAAUAAtgEAIY4BAADPAagBIpABAQC1AQAhoQEBAAAAAaIBAQC1AQAhowEBAM0BACGkAQEAzQEAIaYBAADOAaYBIqgBIADQAQAhAQAAAAEAIA8FAAC-AQAgBgAAwAEAIAoAAL8BACB2AAC8AQAwdwAAAwAQeAAAvAEAMHkBALUBACF_QAC2AQAhgAFAALYBACGRAQAAswEAIJkBAQC1AQAhmgEBALUBACGbAQIAvQEAIZwBAQC1AQAhnQEBALUBACEBAAAAAwAgDQMAANcBACAIAADAAQAgdgAA2gEAMHcAAAUAEHgAANoBADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhAgMAAN0CACAIAAC1AgAgDQMAANcBACAIAADAAQAgdgAA2gEAMHcAAAUAEHgAANoBADB5AQAAAAF8AQC1AQAhf0AAtgEAIYABQAC2AQAhlQFAALYBACGWAQEAtQEAIZcBIADQAQAhmAEBALUBACEDAAAABQAgAQAABgAwAgAABwAgDwMAANcBACAEAAC_AQAgBQAA2AEAIAcAANkBACB2AADVAQAwdwAACQAQeAAA1QEAMHkBALUBACF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACEEAwAA3QIAIAQAALQCACAFAADgAgAgBwAA4QIAIA8DAADXAQAgBAAAvwEAIAUAANgBACAHAADZAQAgdgAA1QEAMHcAAAkAEHgAANUBADB5AQAAAAF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACEDAAAACQAgAQAACgAwAgAACwAgDQQAAL8BACAGAADUAQAgdgAA0wEAMHcAAA0AEHgAANMBADB5AQC1AQAhegEAtQEAIXsBALUBACF8AQC1AQAhfQIAvQEAIX4BALUBACF_QAC2AQAhgAFAALYBACEBAAAADQAgAQAAAAkAIAMAAAAJACABAAAKADACAAALACABAAAABQAgAQAAAAkAIAMAAAAJACABAAAKADACAAALACACBAAAtAIAIAYAAN8CACANBAAAvwEAIAYAANQBACB2AADTAQAwdwAADQAQeAAA0wEAMHkBAAAAAXoBAAAAAXsBALUBACF8AQC1AQAhfQIAvQEAIX4BALUBACF_QAC2AQAhgAFAALYBACEDAAAADQAgAQAAFAAwAgAAFQAgAQAAAAkAIAEAAAANACABAAAAAQAgEQsAANEBACAMAADAAQAgDQAA0gEAIHYAAMwBADB3AAAaABB4AADMAQAweQEAtQEAIX9AALYBACGAAUAAtgEAIY4BAADPAagBIpABAQC1AQAhoQEBALUBACGiAQEAtQEAIaMBAQDNAQAhpAEBAM0BACGmAQAAzgGmASKoASAA0AEAIQULAADdAgAgDAAAtQIAIA0AAN4CACCjAQAAtgIAIKQBAAC2AgAgAwAAABoAIAEAABsAMAIAAAEAIAMAAAAaACABAAAbADACAAABACADAAAAGgAgAQAAGwAwAgAAAQAgDgsAANoCACAMAADbAgAgDQAA3AIAIHkBAAAAAX9AAAAAAYABQAAAAAGOAQAAAKgBApABAQAAAAGhAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpgEAAACmAQKoASAAAAABARMAAB8AIAt5AQAAAAF_QAAAAAGAAUAAAAABjgEAAACoAQKQAQEAAAABoQEBAAAAAaIBAQAAAAGjAQEAAAABpAEBAAAAAaYBAAAApgECqAEgAAAAAQETAAAhADABEwAAIQAwDgsAAL0CACAMAAC-AgAgDQAAvwIAIHkBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKoASKQAQEA4AEAIaEBAQDgAQAhogEBAOABACGjAQEAugIAIaQBAQC6AgAhpgEAALsCpgEiqAEgAIACACECAAAAAQAgEwAAJAAgC3kBAOABACF_QADiAQAhgAFAAOIBACGOAQAAvAKoASKQAQEA4AEAIaEBAQDgAQAhogEBAOABACGjAQEAugIAIaQBAQC6AgAhpgEAALsCpgEiqAEgAIACACECAAAAGgAgEwAAJgAgAgAAABoAIBMAACYAIAMAAAABACAaAAAfACAbAAAkACABAAAAAQAgAQAAABoAIAUJAAC3AgAgIAAAuQIAICEAALgCACCjAQAAtgIAIKQBAAC2AgAgDnYAAMEBADB3AAAtABB4AADBAQAweQEApAEAIX9AAKYBACGAAUAApgEAIY4BAADEAagBIpABAQCkAQAhoQEBAKQBACGiAQEApAEAIaMBAQDCAQAhpAEBAMIBACGmAQAAwwGmASKoASAAuAEAIQMAAAAaACABAAAsADAfAAAtACADAAAAGgAgAQAAGwAwAgAAAQAgDwUAAL4BACAGAADAAQAgCgAAvwEAIHYAALwBADB3AAADABB4AAC8AQAweQEAAAABf0AAtgEAIYABQAC2AQAhkQEAALMBACCZAQEAAAABmgEBALUBACGbAQIAvQEAIZwBAQC1AQAhnQEBALUBACEBAAAAMAAgAQAAADAAIAMFAACzAgAgBgAAtQIAIAoAALQCACADAAAAAwAgAQAAMwAwAgAAMAAgAwAAAAMAIAEAADMAMAIAADAAIAMAAAADACABAAAzADACAAAwACAMBQAAsAIAIAYAALICACAKAACxAgAgeQEAAAABf0AAAAABgAFAAAAAAZEBAACvAgAgmQEBAAAAAZoBAQAAAAGbAQIAAAABnAEBAAAAAZ0BAQAAAAEBEwAANwAgCXkBAAAAAX9AAAAAAYABQAAAAAGRAQAArwIAIJkBAQAAAAGaAQEAAAABmwECAAAAAZwBAQAAAAGdAQEAAAABARMAADkAMAETAAA5ADAMBQAAlwIAIAYAAJkCACAKAACYAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIQIAAAAwACATAAA8ACAJeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIQIAAAADACATAAA-ACACAAAAAwAgEwAAPgAgAwAAADAAIBoAADcAIBsAADwAIAEAAAAwACABAAAAAwAgBQkAAJECACAgAACUAgAgIQAAkwIAIDIAAJICACAzAACVAgAgDHYAALsBADB3AABFABB4AAC7AQAweQEApAEAIX9AAKYBACGAAUAApgEAIZEBAACzAQAgmQEBAKQBACGaAQEApAEAIZsBAgClAQAhnAEBAKQBACGdAQEApAEAIQMAAAADACABAABEADAfAABFACADAAAAAwAgAQAAMwAwAgAAMAAgAQAAAAcAIAEAAAAHACADAAAABQAgAQAABgAwAgAABwAgAwAAAAUAIAEAAAYAMAIAAAcAIAMAAAAFACABAAAGADACAAAHACAKAwAAjwIAIAgAAJACACB5AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABlQFAAAAAAZYBAQAAAAGXASAAAAABmAEBAAAAAQETAABNACAIeQEAAAABfAEAAAABf0AAAAABgAFAAAAAAZUBQAAAAAGWAQEAAAABlwEgAAAAAZgBAQAAAAEBEwAATwAwARMAAE8AMAoDAACBAgAgCAAAggIAIHkBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhlQFAAOIBACGWAQEA4AEAIZcBIACAAgAhmAEBAOABACECAAAABwAgEwAAUgAgCHkBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhlQFAAOIBACGWAQEA4AEAIZcBIACAAgAhmAEBAOABACECAAAABQAgEwAAVAAgAgAAAAUAIBMAAFQAIAMAAAAHACAaAABNACAbAABSACABAAAABwAgAQAAAAUAIAMJAAD9AQAgIAAA_wEAICEAAP4BACALdgAAtwEAMHcAAFsAEHgAALcBADB5AQCkAQAhfAEApAEAIX9AAKYBACGAAUAApgEAIZUBQACmAQAhlgEBAKQBACGXASAAuAEAIZgBAQCkAQAhAwAAAAUAIAEAAFoAMB8AAFsAIAMAAAAFACABAAAGADACAAAHACAIdgAAtAEAMHcAAGEAEHgAALQBADB5AQAAAAF_QAC2AQAhgAFAALYBACGQAQEAAAABkQEAALMBACABAAAAXgAgAQAAAF4AIAh2AAC0AQAwdwAAYQAQeAAAtAEAMHkBALUBACF_QAC2AQAhgAFAALYBACGQAQEAtQEAIZEBAACzAQAgAAMAAABhACABAABiADACAABeACADAAAAYQAgAQAAYgAwAgAAXgAgAwAAAGEAIAEAAGIAMAIAAF4AIAV5AQAAAAF_QAAAAAGAAUAAAAABkAEBAAAAAZEBAAD8AQAgARMAAGYAIAV5AQAAAAF_QAAAAAGAAUAAAAABkAEBAAAAAZEBAAD8AQAgARMAAGgAMAETAABoADAFeQEA4AEAIX9AAOIBACGAAUAA4gEAIZABAQDgAQAhkQEAAPsBACACAAAAXgAgEwAAawAgBXkBAOABACF_QADiAQAhgAFAAOIBACGQAQEA4AEAIZEBAAD7AQAgAgAAAGEAIBMAAG0AIAIAAABhACATAABtACADAAAAXgAgGgAAZgAgGwAAawAgAQAAAF4AIAEAAABhACADCQAA-AEAICAAAPoBACAhAAD5AQAgCHYAALIBADB3AAB0ABB4AACyAQAweQEApAEAIX9AAKYBACGAAUAApgEAIZABAQCkAQAhkQEAALMBACADAAAAYQAgAQAAcwAwHwAAdAAgAwAAAGEAIAEAAGIAMAIAAF4AIAEAAAALACABAAAACwAgAwAAAAkAIAEAAAoAMAIAAAsAIAMAAAAJACABAAAKADACAAALACADAAAACQAgAQAACgAwAgAACwAgDAMAAPUBACAEAAD0AQAgBQAA9gEAIAcAAPcBACB5AQAAAAF7AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECjwEBAAAAAQETAAB8ACAIeQEAAAABewEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAEBEwAAfgAwARMAAH4AMAwDAADsAQAgBAAA6wEAIAUAAO0BACAHAADuAQAgeQEA4AEAIXsBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASKPAQEA4AEAIQIAAAALACATAACBAQAgCHkBAOABACF7AQDgAQAhfAEA4AEAIX9AAOIBACGAAUAA4gEAIYwBQADiAQAhjgEAAOoBjgEijwEBAOABACECAAAACQAgEwAAgwEAIAIAAAAJACATAACDAQAgAwAAAAsAIBoAAHwAIBsAAIEBACABAAAACwAgAQAAAAkAIAMJAADnAQAgIAAA6QEAICEAAOgBACALdgAArgEAMHcAAIoBABB4AACuAQAweQEApAEAIXsBAKQBACF8AQCkAQAhf0AApgEAIYABQACmAQAhjAFAAKYBACGOAQAArwGOASKPAQEApAEAIQMAAAAJACABAACJAQAwHwAAigEAIAMAAAAJACABAAAKADACAAALACABAAAAFQAgAQAAABUAIAMAAAANACABAAAUADACAAAVACADAAAADQAgAQAAFAAwAgAAFQAgAwAAAA0AIAEAABQAMAIAABUAIAoEAADmAQAgBgAA5QEAIHkBAAAAAXoBAAAAAXsBAAAAAXwBAAAAAX0CAAAAAX4BAAAAAX9AAAAAAYABQAAAAAEBEwAAkgEAIAh5AQAAAAF6AQAAAAF7AQAAAAF8AQAAAAF9AgAAAAF-AQAAAAF_QAAAAAGAAUAAAAABARMAAJQBADABEwAAlAEAMAoEAADkAQAgBgAA4wEAIHkBAOABACF6AQDgAQAhewEA4AEAIXwBAOABACF9AgDhAQAhfgEA4AEAIX9AAOIBACGAAUAA4gEAIQIAAAAVACATAACXAQAgCHkBAOABACF6AQDgAQAhewEA4AEAIXwBAOABACF9AgDhAQAhfgEA4AEAIX9AAOIBACGAAUAA4gEAIQIAAAANACATAACZAQAgAgAAAA0AIBMAAJkBACADAAAAFQAgGgAAkgEAIBsAAJcBACABAAAAFQAgAQAAAA0AIAUJAADbAQAgIAAA3gEAICEAAN0BACAyAADcAQAgMwAA3wEAIAt2AACjAQAwdwAAoAEAEHgAAKMBADB5AQCkAQAhegEApAEAIXsBAKQBACF8AQCkAQAhfQIApQEAIX4BAKQBACF_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_QACmAQAhgAFAAKYBACGOAQAAxAGoASKQAQEApAEAIaEBAQCkAQAhogEBAKQBACGjAQEAwgEAIaQBAQDCAQAhpgEAAMMBpgEiqAEgALgBACEOCQAAygEAICAAAMsBACAhAADLAQAggQEBAAAAAYIBAQAAAAWDAQEAAAAFhAEBAAAAAYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQDJAQAhiQEBAAAAAYoBAQAAAAGLAQEAAAABBwkAAKgBACAgAADIAQAgIQAAyAEAIIEBAAAApgECggEAAACmAQiDAQAAAKYBCIgBAADHAaYBIgcJAACoAQAgIAAAxgEAICEAAMYBACCBAQAAAKgBAoIBAAAAqAEIgwEAAACoAQiIAQAAxQGoASIHCQAAqAEAICAAAMYBACAhAADGAQAggQEAAACoAQKCAQAAAKgBCIMBAAAAqAEIiAEAAMUBqAEiBIEBAAAAqAECggEAAACoAQiDAQAAAKgBCIgBAADGAagBIgcJAACoAQAgIAAAyAEAICEAAMgBACCBAQAAAKYBAoIBAAAApgEIgwEAAACmAQiIAQAAxwGmASIEgQEAAACmAQKCAQAAAKYBCIMBAAAApgEIiAEAAMgBpgEiDgkAAMoBACAgAADLAQAgIQAAywEAIIEBAQAAAAGCAQEAAAAFgwEBAAAABYQBAQAAAAGFAQEAAAABhgEBAAAAAYcBAQAAAAGIAQEAyQEAIYkBAQAAAAGKAQEAAAABiwEBAAAAAQiBAQIAAAABggECAAAABYMBAgAAAAWEAQIAAAABhQECAAAAAYYBAgAAAAGHAQIAAAABiAECAMoBACELgQEBAAAAAYIBAQAAAAWDAQEAAAAFhAEBAAAAAYUBAQAAAAGGAQEAAAABhwEBAAAAAYgBAQDLAQAhiQEBAAAAAYoBAQAAAAGLAQEAAAABEQsAANEBACAMAADAAQAgDQAA0gEAIHYAAMwBADB3AAAaABB4AADMAQAweQEAtQEAIX9AALYBACGAAUAAtgEAIY4BAADPAagBIpABAQC1AQAhoQEBALUBACGiAQEAtQEAIaMBAQDNAQAhpAEBAM0BACGmAQAAzgGmASKoASAA0AEAIQuBAQEAAAABggEBAAAABYMBAQAAAAWEAQEAAAABhQEBAAAAAYYBAQAAAAGHAQEAAAABiAEBAMsBACGJAQEAAAABigEBAAAAAYsBAQAAAAEEgQEAAACmAQKCAQAAAKYBCIMBAAAApgEIiAEAAMgBpgEiBIEBAAAAqAECggEAAACoAQiDAQAAAKgBCIgBAADGAagBIgKBASAAAAABiAEgALoBACERBQAAvgEAIAYAAMABACAKAAC_AQAgdgAAvAEAMHcAAAMAEHgAALwBADB5AQC1AQAhf0AAtgEAIYABQAC2AQAhkQEAALMBACCZAQEAtQEAIZoBAQC1AQAhmwECAL0BACGcAQEAtQEAIZ0BAQC1AQAhqQEAAAMAIKoBAAADACADngEAAA0AIJ8BAAANACCgAQAADQAgDQQAAL8BACAGAADUAQAgdgAA0wEAMHcAAA0AEHgAANMBADB5AQC1AQAhegEAtQEAIXsBALUBACF8AQC1AQAhfQIAvQEAIX4BALUBACF_QAC2AQAhgAFAALYBACERAwAA1wEAIAQAAL8BACAFAADYAQAgBwAA2QEAIHYAANUBADB3AAAJABB4AADVAQAweQEAtQEAIXsBALUBACF8AQC1AQAhf0AAtgEAIYABQAC2AQAhjAFAALYBACGOAQAA1gGOASKPAQEAtQEAIakBAAAJACCqAQAACQAgDwMAANcBACAEAAC_AQAgBQAA2AEAIAcAANkBACB2AADVAQAwdwAACQAQeAAA1QEAMHkBALUBACF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACEEgQEAAACOAQKCAQAAAI4BCIMBAAAAjgEIiAEAALEBjgEiEQUAAL4BACAGAADAAQAgCgAAvwEAIHYAALwBADB3AAADABB4AAC8AQAweQEAtQEAIX9AALYBACGAAUAAtgEAIZEBAACzAQAgmQEBALUBACGaAQEAtQEAIZsBAgC9AQAhnAEBALUBACGdAQEAtQEAIakBAAADACCqAQAAAwAgDwMAANcBACAIAADAAQAgdgAA2gEAMHcAAAUAEHgAANoBADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhqQEAAAUAIKoBAAAFACAPBAAAvwEAIAYAANQBACB2AADTAQAwdwAADQAQeAAA0wEAMHkBALUBACF6AQC1AQAhewEAtQEAIXwBALUBACF9AgC9AQAhfgEAtQEAIX9AALYBACGAAUAAtgEAIakBAAANACCqAQAADQAgDQMAANcBACAIAADAAQAgdgAA2gEAMHcAAAUAEHgAANoBADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhAAAAAAABsQEBAAAAAQWxAQIAAAABtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAAAAAQGxAUAAAAABBRoAAIIDACAbAACIAwAgqwEAAIMDACCsAQAAhwMAIK8BAAALACAFGgAAgAMAIBsAAIUDACCrAQAAgQMAIKwBAACEAwAgrwEAAAEAIAMaAACCAwAgqwEAAIMDACCvAQAACwAgAxoAAIADACCrAQAAgQMAIK8BAAABACAAAAABsQEAAACOAQIFGgAA9QIAIBsAAP4CACCrAQAA9gIAIKwBAAD9AgAgrwEAAAEAIAUaAADzAgAgGwAA-wIAIKsBAAD0AgAgrAEAAPoCACCvAQAAMAAgBRoAAPECACAbAAD4AgAgqwEAAPICACCsAQAA9wIAIK8BAAAHACAHGgAA7wEAIBsAAPIBACCrAQAA8AEAIKwBAADxAQAgrQEAAA0AIK4BAAANACCvAQAAFQAgCAQAAOYBACB5AQAAAAF7AQAAAAF8AQAAAAF9AgAAAAF-AQAAAAF_QAAAAAGAAUAAAAABAgAAABUAIBoAAO8BACADAAAADQAgGgAA7wEAIBsAAPMBACAKAAAADQAgBAAA5AEAIBMAAPMBACB5AQDgAQAhewEA4AEAIXwBAOABACF9AgDhAQAhfgEA4AEAIX9AAOIBACGAAUAA4gEAIQgEAADkAQAgeQEA4AEAIXsBAOABACF8AQDgAQAhfQIA4QEAIX4BAOABACF_QADiAQAhgAFAAOIBACEDGgAA9QIAIKsBAAD2AgAgrwEAAAEAIAMaAADzAgAgqwEAAPQCACCvAQAAMAAgAxoAAPECACCrAQAA8gIAIK8BAAAHACADGgAA7wEAIKsBAADwAQAgrwEAABUAIAAAAAKxAQEAAAAEtAEBAAAABQGxAQEAAAAEAAAAAbEBIAAAAAEFGgAA6wIAIBsAAO8CACCrAQAA7AIAIKwBAADuAgAgrwEAADAAIAsaAACDAgAwGwAAiAIAMKsBAACEAgAwrAEAAIUCADCtAQAAhwIAMK4BAACHAgAwrwEAAIcCADCwAQAAhgIAILEBAACHAgAwsgEAAIkCADCzAQAAigIAMAoDAAD1AQAgBAAA9AEAIAcAAPcBACB5AQAAAAF7AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECAgAAAAsAIBoAAI4CACADAAAACwAgGgAAjgIAIBsAAI0CACABEwAA7QIAMA8DAADXAQAgBAAAvwEAIAUAANgBACAHAADZAQAgdgAA1QEAMHcAAAkAEHgAANUBADB5AQAAAAF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACECAAAACwAgEwAAjQIAIAIAAACLAgAgEwAAjAIAIAt2AACKAgAwdwAAiwIAEHgAAIoCADB5AQC1AQAhewEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGMAUAAtgEAIY4BAADWAY4BIo8BAQC1AQAhC3YAAIoCADB3AACLAgAQeAAAigIAMHkBALUBACF7AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIYwBQAC2AQAhjgEAANYBjgEijwEBALUBACEHeQEA4AEAIXsBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASIKAwAA7AEAIAQAAOsBACAHAADuAQAgeQEA4AEAIXsBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASIKAwAA9QEAIAQAAPQBACAHAAD3AQAgeQEAAAABewEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAgMaAADrAgAgqwEAAOwCACCvAQAAMAAgBBoAAIMCADCrAQAAhAIAMK8BAACHAgAwsAEAAIYCACAAAAAAAAKxAQEAAAAEtAEBAAAABQsaAACjAgAwGwAAqAIAMKsBAACkAgAwrAEAAKUCADCtAQAApwIAMK4BAACnAgAwrwEAAKcCADCwAQAApgIAILEBAACnAgAwsgEAAKkCADCzAQAAqgIAMAUaAADkAgAgGwAA6QIAIKsBAADlAgAgrAEAAOgCACCvAQAAAQAgCxoAAJoCADAbAACeAgAwqwEAAJsCADCsAQAAnAIAMK0BAACHAgAwrgEAAIcCADCvAQAAhwIAMLABAACdAgAgsQEAAIcCADCyAQAAnwIAMLMBAACKAgAwCgQAAPQBACAFAAD2AQAgBwAA9wEAIHkBAAAAAXsBAAAAAX9AAAAAAYABQAAAAAGMAUAAAAABjgEAAACOAQKPAQEAAAABAgAAAAsAIBoAAKICACADAAAACwAgGgAAogIAIBsAAKECACABEwAA5wIAMAIAAAALACATAAChAgAgAgAAAIsCACATAACgAgAgB3kBAOABACF7AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASKPAQEA4AEAIQoEAADrAQAgBQAA7QEAIAcAAO4BACB5AQDgAQAhewEA4AEAIX9AAOIBACGAAUAA4gEAIYwBQADiAQAhjgEAAOoBjgEijwEBAOABACEKBAAA9AEAIAUAAPYBACAHAAD3AQAgeQEAAAABewEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAEICAAAkAIAIHkBAAAAAX9AAAAAAYABQAAAAAGVAUAAAAABlgEBAAAAAZcBIAAAAAGYAQEAAAABAgAAAAcAIBoAAK4CACADAAAABwAgGgAArgIAIBsAAK0CACABEwAA5gIAMA0DAADXAQAgCAAAwAEAIHYAANoBADB3AAAFABB4AADaAQAweQEAAAABfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhAgAAAAcAIBMAAK0CACACAAAAqwIAIBMAAKwCACALdgAAqgIAMHcAAKsCABB4AACqAgAweQEAtQEAIXwBALUBACF_QAC2AQAhgAFAALYBACGVAUAAtgEAIZYBAQC1AQAhlwEgANABACGYAQEAtQEAIQt2AACqAgAwdwAAqwIAEHgAAKoCADB5AQC1AQAhfAEAtQEAIX9AALYBACGAAUAAtgEAIZUBQAC2AQAhlgEBALUBACGXASAA0AEAIZgBAQC1AQAhB3kBAOABACF_QADiAQAhgAFAAOIBACGVAUAA4gEAIZYBAQDgAQAhlwEgAIACACGYAQEA4AEAIQgIAACCAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZUBQADiAQAhlgEBAOABACGXASAAgAIAIZgBAQDgAQAhCAgAAJACACB5AQAAAAF_QAAAAAGAAUAAAAABlQFAAAAAAZYBAQAAAAGXASAAAAABmAEBAAAAAQGxAQEAAAAEBBoAAKMCADCrAQAApAIAMK8BAACnAgAwsAEAAKYCACADGgAA5AIAIKsBAADlAgAgrwEAAAEAIAQaAACaAgAwqwEAAJsCADCvAQAAhwIAMLABAACdAgAgAAULAADdAgAgDAAAtQIAIA0AAN4CACCjAQAAtgIAIKQBAAC2AgAgAAAAAAABsQEBAAAAAQGxAQAAAKYBAgGxAQAAAKgBAgcaAADVAgAgGwAA2AIAIKsBAADWAgAgrAEAANcCACCtAQAAAwAgrgEAAAMAIK8BAAAwACALGgAAzAIAMBsAANACADCrAQAAzQIAMKwBAADOAgAwrQEAAIcCADCuAQAAhwIAMK8BAACHAgAwsAEAAM8CACCxAQAAhwIAMLIBAADRAgAwswEAAIoCADALGgAAwAIAMBsAAMUCADCrAQAAwQIAMKwBAADCAgAwrQEAAMQCADCuAQAAxAIAMK8BAADEAgAwsAEAAMMCACCxAQAAxAIAMLIBAADGAgAwswEAAMcCADAIBgAA5QEAIHkBAAAAAXoBAAAAAXwBAAAAAX0CAAAAAX4BAAAAAX9AAAAAAYABQAAAAAECAAAAFQAgGgAAywIAIAMAAAAVACAaAADLAgAgGwAAygIAIAETAADjAgAwDQQAAL8BACAGAADUAQAgdgAA0wEAMHcAAA0AEHgAANMBADB5AQAAAAF6AQAAAAF7AQC1AQAhfAEAtQEAIX0CAL0BACF-AQC1AQAhf0AAtgEAIYABQAC2AQAhAgAAABUAIBMAAMoCACACAAAAyAIAIBMAAMkCACALdgAAxwIAMHcAAMgCABB4AADHAgAweQEAtQEAIXoBALUBACF7AQC1AQAhfAEAtQEAIX0CAL0BACF-AQC1AQAhf0AAtgEAIYABQAC2AQAhC3YAAMcCADB3AADIAgAQeAAAxwIAMHkBALUBACF6AQC1AQAhewEAtQEAIXwBALUBACF9AgC9AQAhfgEAtQEAIX9AALYBACGAAUAAtgEAIQd5AQDgAQAhegEA4AEAIXwBAOABACF9AgDhAQAhfgEA4AEAIX9AAOIBACGAAUAA4gEAIQgGAADjAQAgeQEA4AEAIXoBAOABACF8AQDgAQAhfQIA4QEAIX4BAOABACF_QADiAQAhgAFAAOIBACEIBgAA5QEAIHkBAAAAAXoBAAAAAXwBAAAAAX0CAAAAAX4BAAAAAX9AAAAAAYABQAAAAAEKAwAA9QEAIAUAAPYBACAHAAD3AQAgeQEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAECAAAACwAgGgAA1AIAIAMAAAALACAaAADUAgAgGwAA0wIAIAETAADiAgAwAgAAAAsAIBMAANMCACACAAAAiwIAIBMAANICACAHeQEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGMAUAA4gEAIY4BAADqAY4BIo8BAQDgAQAhCgMAAOwBACAFAADtAQAgBwAA7gEAIHkBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASKPAQEA4AEAIQoDAAD1AQAgBQAA9gEAIAcAAPcBACB5AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECjwEBAAAAAQoFAACwAgAgBgAAsgIAIHkBAAAAAX9AAAAAAYABQAAAAAGRAQAArwIAIJoBAQAAAAGbAQIAAAABnAEBAAAAAZ0BAQAAAAECAAAAMAAgGgAA1QIAIAMAAAADACAaAADVAgAgGwAA2QIAIAwAAAADACAFAACXAgAgBgAAmQIAIBMAANkCACB5AQDgAQAhf0AA4gEAIYABQADiAQAhkQEAAJYCACCaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIQoFAACXAgAgBgAAmQIAIHkBAOABACF_QADiAQAhgAFAAOIBACGRAQAAlgIAIJoBAQDgAQAhmwECAOEBACGcAQEA4AEAIZ0BAQDgAQAhAxoAANUCACCrAQAA1gIAIK8BAAAwACAEGgAAzAIAMKsBAADNAgAwrwEAAIcCADCwAQAAzwIAIAQaAADAAgAwqwEAAMECADCvAQAAxAIAMLABAADDAgAgAwUAALMCACAGAAC1AgAgCgAAtAIAIAAEAwAA3QIAIAQAALQCACAFAADgAgAgBwAA4QIAIAIDAADdAgAgCAAAtQIAIAIEAAC0AgAgBgAA3wIAIAd5AQAAAAF8AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECjwEBAAAAAQd5AQAAAAF6AQAAAAF8AQAAAAF9AgAAAAF-AQAAAAF_QAAAAAGAAUAAAAABDQwAANsCACANAADcAgAgeQEAAAABf0AAAAABgAFAAAAAAY4BAAAAqAECkAEBAAAAAaEBAQAAAAGiAQEAAAABowEBAAAAAaQBAQAAAAGmAQAAAKYBAqgBIAAAAAECAAAAAQAgGgAA5AIAIAd5AQAAAAF_QAAAAAGAAUAAAAABlQFAAAAAAZYBAQAAAAGXASAAAAABmAEBAAAAAQd5AQAAAAF7AQAAAAF_QAAAAAGAAUAAAAABjAFAAAAAAY4BAAAAjgECjwEBAAAAAQMAAAAaACAaAADkAgAgGwAA6gIAIA8AAAAaACAMAAC-AgAgDQAAvwIAIBMAAOoCACB5AQDgAQAhf0AA4gEAIYABQADiAQAhjgEAALwCqAEikAEBAOABACGhAQEA4AEAIaIBAQDgAQAhowEBALoCACGkAQEAugIAIaYBAAC7AqYBIqgBIACAAgAhDQwAAL4CACANAAC_AgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIY4BAAC8AqgBIpABAQDgAQAhoQEBAOABACGiAQEA4AEAIaMBAQC6AgAhpAEBALoCACGmAQAAuwKmASKoASAAgAIAIQsGAACyAgAgCgAAsQIAIHkBAAAAAX9AAAAAAYABQAAAAAGRAQAArwIAIJkBAQAAAAGaAQEAAAABmwECAAAAAZwBAQAAAAGdAQEAAAABAgAAADAAIBoAAOsCACAHeQEAAAABewEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAgMAAAADACAaAADrAgAgGwAA8AIAIA0AAAADACAGAACZAgAgCgAAmAIAIBMAAPACACB5AQDgAQAhf0AA4gEAIYABQADiAQAhkQEAAJYCACCZAQEA4AEAIZoBAQDgAQAhmwECAOEBACGcAQEA4AEAIZ0BAQDgAQAhCwYAAJkCACAKAACYAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIQkDAACPAgAgeQEAAAABfAEAAAABf0AAAAABgAFAAAAAAZUBQAAAAAGWAQEAAAABlwEgAAAAAZgBAQAAAAECAAAABwAgGgAA8QIAIAsFAACwAgAgCgAAsQIAIHkBAAAAAX9AAAAAAYABQAAAAAGRAQAArwIAIJkBAQAAAAGaAQEAAAABmwECAAAAAZwBAQAAAAGdAQEAAAABAgAAADAAIBoAAPMCACANCwAA2gIAIA0AANwCACB5AQAAAAF_QAAAAAGAAUAAAAABjgEAAACoAQKQAQEAAAABoQEBAAAAAaIBAQAAAAGjAQEAAAABpAEBAAAAAaYBAAAApgECqAEgAAAAAQIAAAABACAaAAD1AgAgAwAAAAUAIBoAAPECACAbAAD5AgAgCwAAAAUAIAMAAIECACATAAD5AgAgeQEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGVAUAA4gEAIZYBAQDgAQAhlwEgAIACACGYAQEA4AEAIQkDAACBAgAgeQEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGVAUAA4gEAIZYBAQDgAQAhlwEgAIACACGYAQEA4AEAIQMAAAADACAaAADzAgAgGwAA_AIAIA0AAAADACAFAACXAgAgCgAAmAIAIBMAAPwCACB5AQDgAQAhf0AA4gEAIYABQADiAQAhkQEAAJYCACCZAQEA4AEAIZoBAQDgAQAhmwECAOEBACGcAQEA4AEAIZ0BAQDgAQAhCwUAAJcCACAKAACYAgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIZEBAACWAgAgmQEBAOABACGaAQEA4AEAIZsBAgDhAQAhnAEBAOABACGdAQEA4AEAIQMAAAAaACAaAAD1AgAgGwAA_wIAIA8AAAAaACALAAC9AgAgDQAAvwIAIBMAAP8CACB5AQDgAQAhf0AA4gEAIYABQADiAQAhjgEAALwCqAEikAEBAOABACGhAQEA4AEAIaIBAQDgAQAhowEBALoCACGkAQEAugIAIaYBAAC7AqYBIqgBIACAAgAhDQsAAL0CACANAAC_AgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIY4BAAC8AqgBIpABAQDgAQAhoQEBAOABACGiAQEA4AEAIaMBAQC6AgAhpAEBALoCACGmAQAAuwKmASKoASAAgAIAIQ0LAADaAgAgDAAA2wIAIHkBAAAAAX9AAAAAAYABQAAAAAGOAQAAAKgBApABAQAAAAGhAQEAAAABogEBAAAAAaMBAQAAAAGkAQEAAAABpgEAAACmAQKoASAAAAABAgAAAAEAIBoAAIADACALAwAA9QEAIAQAAPQBACAFAAD2AQAgeQEAAAABewEAAAABfAEAAAABf0AAAAABgAFAAAAAAYwBQAAAAAGOAQAAAI4BAo8BAQAAAAECAAAACwAgGgAAggMAIAMAAAAaACAaAACAAwAgGwAAhgMAIA8AAAAaACALAAC9AgAgDAAAvgIAIBMAAIYDACB5AQDgAQAhf0AA4gEAIYABQADiAQAhjgEAALwCqAEikAEBAOABACGhAQEA4AEAIaIBAQDgAQAhowEBALoCACGkAQEAugIAIaYBAAC7AqYBIqgBIACAAgAhDQsAAL0CACAMAAC-AgAgeQEA4AEAIX9AAOIBACGAAUAA4gEAIY4BAAC8AqgBIpABAQDgAQAhoQEBAOABACGiAQEA4AEAIaMBAQC6AgAhpAEBALoCACGmAQAAuwKmASKoASAAgAIAIQMAAAAJACAaAACCAwAgGwAAiQMAIA0AAAAJACADAADsAQAgBAAA6wEAIAUAAO0BACATAACJAwAgeQEA4AEAIXsBAOABACF8AQDgAQAhf0AA4gEAIYABQADiAQAhjAFAAOIBACGOAQAA6gGOASKPAQEA4AEAIQsDAADsAQAgBAAA6wEAIAUAAO0BACB5AQDgAQAhewEA4AEAIXwBAOABACF_QADiAQAhgAFAAOIBACGMAUAA4gEAIY4BAADqAY4BIo8BAQDgAQAhBAkACAsEAgwTBA0WBQQFCAMGEAQJAAcKAAEDAwACCAwECQAGBAMAAgQAAQUAAwcOBQIEAAEGAAQBCA8AAgURAAYSAAIMFwANGAAAAAADCQANIAAOIQAPAAAAAwkADSAADiEADwEKAAEBCgABBQkAFCAAFyEAGDIAFTMAFgAAAAAABQkAFCAAFyEAGDIAFTMAFgEDAAIBAwACAwkAHSAAHiEAHwAAAAMJAB0gAB4hAB8AAAADCQAlIAAmIQAnAAAAAwkAJSAAJiEAJwMDAAIEAAEFAAMDAwACBAABBQADAwkALCAALSEALgAAAAMJACwgAC0hAC4CBAABBgAEAgQAAQYABAUJADMgADYhADcyADQzADUAAAAAAAUJADMgADYhADcyADQzADUOAgEPGQEQHAERHQESHgEUIAEVIgkWIwoXJQEYJwkZKAscKQEdKgEeKwkiLgwjLxAkMQIlMgImNAInNQIoNgIpOAIqOgkrOxEsPQItPwkuQBIvQQIwQgIxQwk0RhM1Rxk2SAM3SQM4SgM5SwM6TAM7TgM8UAk9URo-UwM_VQlAVhtBVwNCWANDWQlEXBxFXSBGXyFHYCFIYyFJZCFKZSFLZyFMaQlNaiJObCFPbglQbyNRcCFScSFTcglUdSRVdihWdwRXeARYeQRZegRaewRbfQRcfwldgAEpXoIBBF-EAQlghQEqYYYBBGKHAQRjiAEJZIsBK2WMAS9mjQEFZ44BBWiPAQVpkAEFapEBBWuTAQVslQEJbZYBMG6YAQVvmgEJcJsBMXGcAQVynQEFc54BCXShATJ1ogE4"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
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
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

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
var JWT_SECRET = process.env.JWT_SECRET;
var registerUser = async (payload) => {
  const { name, email, password, role } = payload;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already registered");
  const hashedPassword = await bcrypt.hash(password, 10);
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
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
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
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
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
var AuthController = {
  // Add controller methods here
  registerUser: registerUser2,
  loginUser: loginUser2,
  logoutUser,
  meUser,
  handleAvatarChange
};

// src/modules/Auth/auth.route.ts
var router = express.Router();
router.get("/me");
router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/login");
router.put("/changePassword");
router.delete("deleteAccount");
var AuthRoutes = router;

// src/modules/tutor/tutor.route.ts
import { Router as Router2 } from "express";

// src/middlewares/auth.ts
import jwt2 from "jsonwebtoken";

// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
var envSchema = z.object({
  PORT: z.coerce.number().default(5e3),
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  JWT_SECRET: z.string(),
  CLOUDINARY_SECRET: z.string(),
  CLOUDINARY_KEY: z.string(),
  CLOUDINARY_NAME: z.string()
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid or missing environment variables:\n", parsed.error.issues);
  console.error(parsed.error.format());
  process.exit(1);
}
var envConfig = parsed.data;

// src/middlewares/auth.ts
var JWT_SECRET2 = envConfig.JWT_SECRET;
if (!JWT_SECRET2) {
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
    const payload = jwt2.verify(token, JWT_SECRET2);
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
var updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const profile = await tutorServices.updateTutorProfile(userId, req.body);
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
var getProfile = async (req, res) => {
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
  updateProfile,
  getProfile,
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

// src/modules/tutor/tutor.schema.ts
import { z as z2 } from "zod";
var createTutorProfileSchema = z2.object({
  body: z2.object({
    bio: z2.string({
      required_error: "Bio is required"
    }).min(10, "Bio must be at least 10 characters long"),
    hourlyRate: z2.number({
      required_error: "Hourly rate is required",
      invalid_type_error: "Hourly rate must be a number"
    }).positive("Hourly rate must be a positive number"),
    category: z2.string({
      required_error: "Category is required"
    }).min(2, "Category must be at least 2 characters long"),
    subjects: z2.array(
      z2.string().min(2, "Each subject must be at least 2 characters long")
    ).min(1, "At least one subject is required")
  })
});
var addAvailabilitySchema = z2.object({
  body: z2.object({
    date: z2.string({
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
    startTime: z2.string(),
    endTime: z2.string()
  })
});
var tutorSchemas = {
  createTutorProfileSchema,
  addAvailabilitySchema
};

// src/modules/tutor/tutor.route.ts
var router2 = Router2();
var tutorsRouterPublic = Router2();
router2.post("/profile", authMiddleware, roleMiddleware(["TUTOR"]), validateRequest(tutorSchemas.createTutorProfileSchema), tutorControllers.createProfile);
router2.put("/profile", authMiddleware, roleMiddleware(["TUTOR"]), tutorControllers.updateProfile);
router2.get("/sessions", authMiddleware, roleMiddleware(["TUTOR"]), tutorControllers.getTutorSessions);
router2.get("/dashboard-data/:tutorId", authMiddleware, roleMiddleware(["TUTOR"]), tutorControllers.getTutorDashboard);
router2.put("/sessions/:sessionId/finish-session", authMiddleware, roleMiddleware(["TUTOR"]), tutorControllers.markedSessionFinishController);
router2.put("/availability", authMiddleware, roleMiddleware(["TUTOR"]), validateRequest(tutorSchemas.addAvailabilitySchema), tutorControllers.addAvailabilityController);
router2.get("/availability", authMiddleware, roleMiddleware(["TUTOR"]), tutorControllers.getAllAvailabilities);
router2.get("/get-dashboard-data", authMiddleware, roleMiddleware(["TUTOR"]), tutorControllers.getTutorDashboard);
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
  origin: ["http://localhost:5000", "https://skill-bridge-frontend-gamma.vercel.app", "https://skill-bridge-frontend-4vp4.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
};

// src/middlewares/index.ts
import cookieParser from "cookie-parser";
import cors from "cors";

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

// src/app.ts
var app = express2();
app.use(express2.json());
app.set("trust proxy", 1);
app.use(cookieParser2());
app.use(express2.json({ limit: "1mb" }));
app.use(cors2(corsConfig));
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.use("/api/v1/tutor", TutorRoutes);
app.get("/", (req, res) => {
  res.send("Hello Mainuddin Khan!");
});
app.use(notFound);
app.use(errorHandler);
var app_default = app;

// src/config/index.ts
import dotenv2 from "dotenv";
import path from "path";
dotenv2.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL
};

// src/server.ts
var PORT = process.env.PORT;
async function main() {
  try {
    app_default.listen(config_default.port, () => {
      console.log(`Example app listening on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();
//# sourceMappingURL=server.js.map