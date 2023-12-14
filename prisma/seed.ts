// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function seed() {

//     // await prisma.designation.createMany({
//     //     data: [
//     //         {id: "6568cf375f945c327873c021", name: "Trainee"},
//     //         {id: "6568cf375f945c327873c022", name: "Software Engineer"},
//     //         {id: "6568cf375f945c327873c023", name: "Senior Software Engineer"},
//     //         {id: "6568cf375f945c327873c024", name: "Technology Analyst"},
//     //         {id: "6568cf375f945c327873c025", name: "Technical lead"},
//     //         {id: "6568cf375f945c327873c026", name: "Manager"},
//     //         {id: "6568cf375f945c327873c027", name: "Architect"},
//     //         {id: "6568cf375f945c327873c028", name: "Senior Architect"},
//     //         {id: "6568cf375f945c327873c029", name: "Human Resource"},
//     //         {id: "6568cf375f945c327873c010", name: "Designer"},
//     //         {id: "6568cf375f945c327873c011", name: "CEO"},
//     //         {id: "6568cf375f945c327873c012", name: "CTO"},
//     //     ]
//     // })

//     await prisma.employee.upsert({
//         where: { id: "6568cf375f945c327873c021" },
//         create: {
//             id: "6568cf375f945c327873c021",
//             name: "Alex",
//             phone: "+91 8124460585",
//             email: "alex@gands.com",
//             dateOfBirth: "25-06-1978",
//             dateOfJoin: "15-04-2015",
//             employeeId: "FEC0001",
//             designation: {
//                 connect: {
//                     id: "6568cf375f945c327873c012"
//                 }
//             },
//             role: "ADMIN",
//             gender: "Male"
//         },
//         update: {}
//     })

//     await prisma.employee.upsert({
//         where: { id: "6568cf375f945c327873c022" },
//         create: {
//             id: "6568cf375f945c327873c022",
//             name: "Bob",
//             phone: "+91 8124560589",
//             email: "bob@gands.com",
//             dateOfBirth: "25-07-1979",
//             dateOfJoin: "15-02-2016",
//             employeeId: "FEC0010",
//             designation: {
//                 connect: {
//                     id: "6568cf375f945c327873c023"
//                 }
//             },
//             role: "INTERN",
//             gender: "Male"
//         },
//         update: {}
//     })

//     await prisma.employee.upsert({
//         where: { id: "6568cf375f945c327873c033" },
//         create: {
//             id: "6568cf375f945c327873c033",
//             name: "EMploye 1",
//             phone: "+91 8124560589",
//             email: "emp@gands.com",
//             dateOfBirth: "25-07-1998",
//             dateOfJoin: "15-02-2023",
//             employeeId: "FEC1114",
//             designation: {
//                 connect: {
//                     id: "6568cf375f945c327873c022"
//                 }
//             },
//             role: "INTERN",
//             gender: "Male"
//         },
//         update: {}
//     })

//     await prisma.employee.create({
//         data: {
//           name: 'Bino',
//           phone: '9287628332',
//           email: 'bini@gmail.com',
//           designation: { connect: { id: '6568cf375f945c327873c021' } },
//           dateOfBirth: '25-06-1998',
//           dateOfJoin: '25-06-1998',
//           employeeId: 'FEC011',
//           role: "INTERN",
//         gender: "Male"
//         }
//       })

//     await prisma.project.upsert({
//         where: {
//             id: "6568cf375f945c327873c033"
//         },
//         update: {},
//         create: {
//             id: "6568cf375f945c327873c033",
//             name: "FIDIO",
//             description: "Industry Management Software",
//             tools: ["VueJs", "Vite", "NodeJs", "Mongodb"],
//             projectStatus: "PROCESSING",
//             guide: "Guide",
//             startDate: "2022-10-10",
//             endDate: "2023-10-10"
//         }
//     })

//     await prisma.project.create({
//         // where: {
//         //     id: "6568cf375f945c327873c034"
//         // },
//         // update: {},
//         data:{
//             name: 'FIDIO',
//             description: 'DESC',
//             lead: { connect: { id: '6568cf375f945c327873c021' } },
//             manager: { connect: { id: '6568cf375f945c327873c022' } },
//             projectStatus: 'idle',
//             tools: [ 'vs Code' ],
//             guide: 'Guide',
//             startDate: '2023-10-11',
//             endDate: '2024-10-11'
//           }
//     })

//     // await prisma.employeeProject.create({
//     //     data: {
//     //         employeeId: "6568cf375f945c327873c022",
//     //         projectId: "6568cf375f945c327873c033",
//     //         shadowId: "6568cf375f945c327873c033"
//     //     }
//     // })

//     // const projectDetails = await prisma.employeeProject.findMany({
//     //     where: {
//     //         projectId: "6568cf375f945c327873c033",
//     //         // employeeId: "6568cf375f945c327873c033",
//     //         // shadowId: "6568cf375f945c327873c033",
//     //     },
//     //     include: {
//     //         project: true,
//     //         employee: true,
//     //         shadow: true
//     //     },
//     //     skip: 0,
//     //     take: 1,
//     // })

//     // const project =  await prisma.project.update({
//     //     where : {id: "6568cf375f945c327873c034"},
//     //     data: {
//     //         // lead: {
//     //         //     connect: {
//     //         //         id: "6568cf375f945c327873c021"
//     //         //     }
//     //         // },
//     //         // manager: {
//     //         //     connect: {
//     //         //         id: "6568cf375f945c327873c022"
//     //         //     }
//     //         // },
//     //     }
//     // })

//     // const employee = await prisma.employee.findMany({
//     //     where: {
//     //         // name: {
//     //         //     contains: "alex",
//     //         //     mode: "insensitive",
//     //         // },
//     //         id: {
//     //             in: ["6568cf375f945c327873c021"]
//     //         }
//     //     },
//     //     // include: {
//     //     //     directProject: {
//     //     //         include: {
//     //     //             project: {
//     //     //                 include: {
//     //     //                     lead: true,
//     //     //                     manager: true
//     //     //                 }
//     //     //             },
//     //     //         }
//     //     //     },
//     //     //     shadowProject: {
//     //     //         include: {
//     //     //             project: {
//     //     //                 include: {
//     //     //                     lead: true,
//     //     //                     manager: true
//     //     //                 }
//     //     //             },
//     //     //         }
//     //     //     },
//     //     //     designation: true,
//     //     //     leadOf: true
//     //     // }
//     // })

//     // const project = await prisma.project.findMany({
//     //     where: {
//     //         id: "6568cf375f945c327873c033"
//     //     },
//     //     include: {
//     //         lead: true,
//     //         employee: {
//     //             include: {
//     //                 employee: {
//     //                     include: {
//     //                         designation: true
//     //                     }
//     //                 },
//     //                 shadow: {
//     //                     include: {
//     //                         designation: true
//     //                     }
//     //                 },

//     //             }
//     //         },
//     //         manager: true
//     //     }
//     // })

//     // console.dir(employee, { depth: null })
// }

// seed().then(res => {
//     console.log("Seeded")
// }).catch(err => {
//     console.log(err)
//     console.log("Error while Seed")
// })