import EnvVars from "@src/configurations/EnvVars";
import axios from "axios";

async function generateResult() {
  const textToSearchUrl = `${EnvVars.reckonBaseUrl}/textToSearch`;
  const subTextsUrl = `${EnvVars.reckonBaseUrl}/subTexts`;
  const submitResultsUrl = `${EnvVars.reckonBaseUrl}/submitResults`;

  const {
    textToSearchData: { text: textToSearch },
    subTextsData: { subTexts },
  } = await retryGet([textToSearchUrl, subTextsUrl]);
  const subTextsPosition = getSubTextsPositions(textToSearch, subTexts);
  const formattedResult = {
    candidate: "Rohit Arjunagi",
    text: textToSearch,
    result: subTextsPosition,
  };
  console.log("formattedResult", formattedResult);
  return retryPost(submitResultsUrl, formattedResult);
}

function getSubTextsPositions(textToSearch: string, subTexts: string[]) {
  const subTextPositions = [];
  for (const subText of subTexts) {
    const result = isSubstring(textToSearch, subText);
    if (result) {
      subTextPositions.push({
        subText,
        result: result.join(", "),
      });
    } else {
      subTextPositions.push({
        subText,
        result: "<No Output>",
      });
    }
  }
  return subTextPositions;
}

function isSubstring(textToSearch: string, substring: string) {
  if (substring.length > textToSearch.length) return;
  const startChar = substring[0].toLowerCase();
  const arr = [];
  for (let searchIndex = 0; searchIndex < textToSearch.length; searchIndex++) {
    if (textToSearch[searchIndex].toLowerCase() === startChar) {
      let fullMatch = true;
      for (
        let substringIndex = 1;
        substringIndex < substring.length;
        substringIndex++
      ) {
        if (
          substring[substringIndex].toLowerCase() ===
          textToSearch[searchIndex + substringIndex].toLowerCase()
        )
          continue;
        else fullMatch = false;
      }
      if (fullMatch) arr.push(searchIndex + 1);
    }
  }
  return arr;
}

async function retryGet(urls: string[], retries = 0): Promise<any> {
  const maxRetries = EnvVars.maxRetries;
  let resultData = {};
  try {
    const [{ data: textToSearchData }, { data: subTextsData }] =
      await Promise.all(
        urls.map((url) => {
          return axios.get(url, {
            headers: {
              Accept: "application/json",
            },
          });
        })
      );
    return {
      textToSearchData,
      subTextsData,
    };
  } catch (err) {
    if (retries < maxRetries) {
      retries += 1;
      return retryGet(urls, retries);
    } else {
      return resultData;
    }
  }
}

async function retryPost(url: string, body: any, retries = 0): Promise<any> {
  const maxRetries = EnvVars.maxRetries;
  let resultData = {};
  try {
    const { data, status } = await axios.post(url, {
      headers: {
        Accept: "application/json",
      },
      body,
    });
    return data;
  } catch (err) {
    if (retries < maxRetries) {
      retries += 1;
      return retryPost(url, body, retries);
    } else {
      return resultData;
    }
  }
}

// **** Export default **** //

export default {
  generateResult,
} as const;
