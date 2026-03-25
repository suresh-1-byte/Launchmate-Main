import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create demo users
    const password = await bcrypt.hash("password123", 12);

    const user1 = await prisma.user.upsert({
        where: { email: "rahul@demo.com" },
        update: {},
        create: {
            name: "Rahul Sharma",
            email: "rahul@demo.com",
            password,
            skills: ["JavaScript", "React", "Node.js", "Python"].join(", "),
            bio: "Full-stack developer and tech enthusiast from Bangalore",
            role: "student",
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: "priya@demo.com" },
        update: {},
        create: {
            name: "Priya Patel",
            email: "priya@demo.com",
            password,
            skills: ["Python", "Machine Learning", "Data Science", "SQL"].join(", "),
            bio: "Aspiring data scientist from Mumbai",
            role: "student",
        },
    });

    const user3 = await prisma.user.upsert({
        where: { email: "amit@demo.com" },
        update: {},
        create: {
            name: "Amit Kumar",
            email: "amit@demo.com",
            password,
            skills: ["Java", "Spring Boot", "AWS", "Docker"].join(", "),
            bio: "Backend developer passionate about cloud computing",
            role: "student",
        },
    });

    const user4 = await prisma.user.upsert({
        where: { email: "sneha@demo.com" },
        update: {},
        create: {
            name: "Sneha Reddy",
            email: "sneha@demo.com",
            password,
            skills: ["UI/UX", "Figma", "React", "CSS"].join(", "),
            bio: "Creative designer transitioning to frontend development",
            role: "student",
        },
    });

    // Create courses
    const courses = await Promise.all([
        prisma.course.upsert({
            where: { id: "course-1" },
            update: {},
            create: {
                id: "course-1",
                title: "Complete Web Development Bootcamp",
                description: "Master HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build 20+ real projects from scratch.",
                level: "beginner",
                duration: "40 hours",
                category: "web-development",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-2" },
            update: {},
            create: {
                id: "course-2",
                title: "Python for Data Science & Machine Learning",
                description: "Learn Python, Pandas, NumPy, Matplotlib, Scikit-Learn, and build ML models with real datasets.",
                level: "intermediate",
                duration: "35 hours",
                category: "data-science",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-3" },
            update: {},
            create: {
                id: "course-3",
                title: "DSA Masterclass for Placements",
                description: "Complete Data Structures & Algorithms course with 200+ problems. Crack FAANG interviews.",
                level: "intermediate",
                duration: "50 hours",
                category: "dsa",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-4" },
            update: {},
            create: {
                id: "course-4",
                title: "Cloud Computing with AWS",
                description: "Learn AWS services: EC2, S3, Lambda, DynamoDB, CloudFormation. Prepare for AWS certification.",
                level: "advanced",
                duration: "30 hours",
                category: "cloud",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-5" },
            update: {},
            create: {
                id: "course-5",
                title: "Mobile App Development with React Native",
                description: "Build cross-platform mobile apps with React Native. Deploy to App Store and Play Store.",
                level: "intermediate",
                duration: "25 hours",
                category: "mobile",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-6" },
            update: {},
            create: {
                id: "course-6",
                title: "DevOps & CI/CD Pipeline",
                description: "Learn Docker, Kubernetes, Jenkins, GitHub Actions, and modern DevOps practices.",
                level: "advanced",
                duration: "28 hours",
                category: "devops",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-7" },
            update: {},
            create: {
                id: "course-7",
                title: "UI/UX Design Fundamentals",
                description: "Master design thinking, wireframing, prototyping with Figma, and user research methodologies.",
                level: "beginner",
                duration: "20 hours",
                category: "design",
            },
        }),
        prisma.course.upsert({
            where: { id: "course-8" },
            update: {},
            create: {
                id: "course-8",
                title: "System Design for Interviews",
                description: "Learn to design scalable systems. Cover load balancing, caching, databases, and microservices.",
                level: "advanced",
                duration: "22 hours",
                category: "system-design",
            },
        }),
    ]);

    // Create enrollments
    await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: user1.id, courseId: courses[0].id } },
        update: {},
        create: { userId: user1.id, courseId: courses[0].id, progress: 65 },
    });
    await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: user1.id, courseId: courses[2].id } },
        update: {},
        create: { userId: user1.id, courseId: courses[2].id, progress: 30 },
    });
    await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: user2.id, courseId: courses[1].id } },
        update: {},
        create: { userId: user2.id, courseId: courses[1].id, progress: 80 },
    });

    // Create projects
    await prisma.project.upsert({
        where: { id: "project-1" },
        update: {},
        create: {
            id: "project-1",
            userId: user1.id,
            title: "E-Commerce Platform",
            description: "Full-stack e-commerce app with payment integration, cart system, and admin dashboard built with React and Node.js.",
            githubLink: "https://github.com/rahul/ecommerce-platform",
            score: 85,
        },
    });
    await prisma.project.upsert({
        where: { id: "project-2" },
        update: {},
        create: {
            id: "project-2",
            userId: user2.id,
            title: "Stock Price Predictor",
            description: "ML model using LSTM neural networks to predict stock prices with 89% accuracy on historical data.",
            githubLink: "https://github.com/priya/stock-predictor",
            score: 92,
        },
    });

    // Create sample jobs
    const jobs = [
        {
            id: "job-1",
            title: "Software Development Engineer",
            company: "Infosys",
            location: "Bangalore, India",
            description: "Join our team as an SDE working on enterprise applications. Requirements: Java/Python, Spring Boot, Microservices. 0-2 years experience.",
            applyUrl: "https://careers.infosys.com",
            salary: "₹5,00,000 - ₹8,00,000",
        },
        {
            id: "job-2",
            title: "Frontend Developer",
            company: "TCS",
            location: "Hyderabad, India",
            description: "Build modern web applications using React.js, TypeScript, and modern CSS frameworks. 0-3 years experience required.",
            applyUrl: "https://careers.tcs.com",
            salary: "₹4,50,000 - ₹7,50,000",
        },
        {
            id: "job-3",
            title: "Data Analyst",
            company: "Wipro",
            location: "Mumbai, India",
            description: "Analyze business data using Python, SQL, and Tableau. Create dashboards and insights. Freshers welcome.",
            applyUrl: "https://careers.wipro.com",
            salary: "₹4,00,000 - ₹6,50,000",
        },
        {
            id: "job-4",
            title: "Cloud Engineer",
            company: "Amazon",
            location: "Bangalore, India",
            description: "Work with AWS services to build and maintain cloud infrastructure. Experience with EC2, S3, Lambda preferred.",
            applyUrl: "https://amazon.jobs",
            salary: "₹12,00,000 - ₹20,00,000",
        },
        {
            id: "job-5",
            title: "Full Stack Developer",
            company: "Flipkart",
            location: "Bangalore, India",
            description: "Build scalable web applications using React, Node.js, and PostgreSQL. Work in an agile team environment.",
            applyUrl: "https://careers.flipkart.com",
            salary: "₹10,00,000 - ₹18,00,000",
        },
        {
            id: "job-6",
            title: "Machine Learning Engineer",
            company: "Google",
            location: "Hyderabad, India",
            description: "Develop and deploy ML models at scale. Strong background in Python, TensorFlow, and statistics required.",
            applyUrl: "https://careers.google.com",
            salary: "₹18,00,000 - ₹35,00,000",
        },
    ];

    for (const job of jobs) {
        await prisma.job.upsert({
            where: { id: job.id },
            update: {},
            create: job,
        });
    }

    // Create connections
    await prisma.connection.upsert({
        where: { senderId_receiverId: { senderId: user1.id, receiverId: user2.id } },
        update: {},
        create: { senderId: user1.id, receiverId: user2.id, status: "accepted" },
    });
    await prisma.connection.upsert({
        where: { senderId_receiverId: { senderId: user3.id, receiverId: user1.id } },
        update: {},
        create: { senderId: user3.id, receiverId: user1.id, status: "pending" },
    });

    console.log("✅ Database seeded successfully!");
    console.log("📧 Demo accounts:");
    console.log("   rahul@demo.com / password123");
    console.log("   priya@demo.com / password123");
    console.log("   amit@demo.com / password123");
    console.log("   sneha@demo.com / password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
