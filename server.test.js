const app = require("./server");
const request = require("supertest");
const mongoose=require("mongoose");

// beforeAll(async ()=>
// {
//     const CommentsClient=await mongoose.createConnection(process.env.COMMENTS_URI).asPromise();
//     const ProcessedDataClient=await mongoose.createConnection(process.env.PROCESSED_DATA_URI).asPromise();
//     const UserClient=await mongoose.createConnection(process.env.USER_URI).asPromise();
//     const ContentClient=await mongoose.createConnection(process.env.CONTENT_URI).asPromise();
//     const ProcessedContentClient=await mongoose.createConnection(process.env.PROCESSES_CONTENT_URI).asPromise();
// })

// afterAll(async ()=>
// {
//     await CommentsClient.close();
//     await ProcessedDataClient.close();
//     await UserClient.close();
//     await ContentClient.close();
//     await ProcessedContentClient.close();
// })


describe("Base URL test",()=>
{
    test("Checking if the server is ON",async ()=>
    {
        const response = await request(app).get("/");
        expect(response.body.status).toBe("server is actively listening");
        expect(response.status).toBe(200);
    },15000)

})



describe("API for accessing top positive/negative comments",()=>
{
    test("Does this API work? when source=facebook,sentiment=positive,count=10",async ()=>
    {
        const response= await request(app).get("/api/data/facebook/positive/10");
        // expect(Object.entries(response.body).length).toBe(10);
        expect(response.status).toBe(200);
        expect(response.body[0].source).toBe("facebook");
        expect(response.body[0].sentiment).toBeGreaterThan(0);
    },15000)

    test("Does this API work? when source=instagram,sentiment=positive,count=10",async ()=>
    {
        const response= await request(app).get("/api/data/instagram/positive/10");
        // expect(response.body.length).toBe(10);
        expect(response.status).toBe(200);
        expect(response.body[0].source).toBe("instagram");
        expect(response.body[0].sentiment).toBeGreaterThan(0);
    },15000)

    test("Does this API work? when source=instagram,sentiment=negative,count=5",async ()=>
    {
        const response= await request(app).get("/api/data/instagram/negative/5");
        // expect(response.body.length).toBe(5);
        expect(response.status).toBe(200);
        expect(response.body[0].source).toBe("instagram");
        expect(response.body[0].sentiment).toBeLessThan(0);
    },15000)
})


describe("API to access all processed data",()=>
{
    test("Check if this end point works",async ()=>
    {
        const response=await request(app).get("/api/data/all");
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.body[0]).toHaveProperty("date");
        expect(response.status).toBe(200);
    },15000)
})


describe("API to access dated data",()=>
{
    test("Check if this api works",async ()=>
    {
        const response=await request(app).get("/api/data/daily");
        expect(response.body[0]).toHaveProperty("date");
        expect(response.body[0]).toHaveProperty("positive");
        expect(response.body[0]).toHaveProperty("negative");
        expect(response.status).toBe(200);
    },15000)
})


describe("API to access top content",()=>
{
    test("Check if this API works",async ()=>
    {
        const response=await request(app).get("/api/data/top-content");
        expect(response.body[0]).toHaveProperty("_id");
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("caption");
        expect(response.body[0]).toHaveProperty("comments");
        expect(response.body[0]).toHaveProperty("source");
        expect(response.body[0]).toHaveProperty("ratio");
        expect(response.body[0]).toHaveProperty("positive");
    },15000)
})