"use server";
import Question from "@/databse/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/databse/user.model";
import Answer from "@/databse/answer.model";
import Tag from "@/databse/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase();
    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLower = type?.toLowerCase();

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      /**
       * If user does not selected any filter in the global search...
       * SEARCH ACROSS EVERYTHING
       */
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      /**
       * Search in the specified model type
       */
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      console.log({ modelInfo, type });
      if (!modelInfo) {
        throw new Error("Invalid search type");
      }
      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
              ? item.question
              : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.error(`Error fetching global result: ${error}`);
    throw error;
  }
}
