const replicateProxy = "https://replicate-api-proxy.glitch.me";

document.getElementById("submit").addEventListener("click", function () {
    let prompt = document.getElementById("colorPicker").value;
    console.log("Prompt", prompt);
    askForEmbeddings( "#7B3F00" + "," + prompt);
});


async function askForEmbeddings(p_prompt) {
  let promptInLines = p_prompt.replace(/,/g, "\n");
  let data = {
    version: "75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
    input: {
      inputs: promptInLines,
    },
  };
  console.log("Asking for Picture Info From Replicate via Proxy", data);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const url = replicateProxy + "/create_n_get/";
  console.log("url", url, "options", options);
  const raw = await fetch(url, options);
  //console.log("raw", raw);
  const proxy_said = await raw.json();
  let output = proxy_said.output;
  console.log("Proxy Returned", output);
  distances = []
  let firstOne = output[0];
    let thisOne = output[1];
    console.log("First", thisOne);
    let cdist = cosineSimilarity(firstOne.embedding, thisOne.embedding);
    let child = document.createElement("div");
    child.style.backgroundColor = thisOne.input;
    child.textContent = cdist*100 + "%";
    child.style.color = "white";
    document.getElementById("result").appendChild(child);
}

function cosineSimilarity(vecA,vecB){
    return dotProduct(vecA,vecB)/ (magnitude(vecA) * magnitude(vecB));
}

function dotProduct(vecA, vecB){
    let product = 0;
    for(let i=0;i<vecA.length;i++){
        product += vecA[i] * vecB[i];
    }
    return product;
}

function magnitude(vec){
    let sum = 0;
    for (let i = 0;i<vec.length;i++){
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}