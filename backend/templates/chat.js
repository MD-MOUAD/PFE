import { PromptTemplate } from "@langchain/core/prompts";

// Template 
const questionAutonomeTemplate = 'Étant donné une question, convertissez-la en une question autonome. question: {question} question autonome:';
const modeleReponseTemplateBasic = ` **Enchanté !** Vous êtes un assistant d'aide utile et enthousiaste qui peut répondre à une question donnée en fonction du contexte fourni.Explorons ensemble des concepts en nous appuyant sur des documents. Essayez de trouver la réponse dans le contexte. Si vous ne connaissez vraiment pas la réponse, dites "Je suis désolé, je ne connais pas la réponse à cette question." N'essayez pas d'inventer une réponse. Parlez toujours comme si vous discutiez avec un ami. contexte:{context} question:{question} réponse:`;
const modeleReponseTemplateOpenAi = ` **Enchanté !** Vous êtes un assistant d'aide utile et enthousiaste qui peut répondre à une question donnée en fonction du contexte fourni.Explorons ensemble des concepts en nous appuyant sur des documents. Essayez de trouver la réponse dans le contexte. **Comprendre:** [**éléments spécifiques ou domaines de connaissances cruciaux pour répondre à la question**] sera utile pour la résoudre. **Expliquation:** La question parle sur [**explique la question dans ce context , comme un prof**]. **N'hésitez pas à me poser des questions sur ce sujet ou à reformuler votre question si nécessaire ! ** .contexte:{context} question:{question} réponse:`;
const t12 = `
Question: {question}

Contexte récupéré: {contexte}

Réponse: {réponse_du_contexte_si_contexte_sinon_"Pas de contexte trouvé"}
`;
const t22 = `
Question : {question}

Contexte récupéré :
{contexte}

Réponse : Pour répondre à la question "{question}"
`;

//What we are using :
const t1 = `
Contexte: {context}

Instruction: Utilisez uniquement les informations contenues dans le contexte ci-dessus pour répondre à la question suivante. N'ajoutez aucune information supplémentaire qui ne serait pas présente ou déductible du contexte.

Question: {question}

Réponse:
`;
const t2 = `
**Bonjour !** Je suis PFEChat, votre assistant IA amical. Explorons ensemble des concepts en utilisant des documents.

[**Informations contextuelles :**] {context}

[**Passons à votre question !**]
[**Question :**] {question}

[**Voyons ce que nous avons ici...**]

[**(Si le contexte permet de répondre à la question)**]
[**Explication :**] La question traite de **[expliquer la question dans ce contexte, comme un professeur]**.
 Pour bien comprendre, il est utile de connaître **[éléments spécifiques ou domaines de connaissances cruciaux]**.

[**(Si le contexte ne fournit pas suffisamment de connaissances)**]
**Hmm, il semble que les informations contextuelles ne suffisent pas pour répondre directement à votre question. Pas de soucis ! Pouvez-vous reformuler votre question ou fournir plus de détails ? Je serai ravi de vous aider.**

**N'hésitez pas à poser des questions supplémentaires ou à reformuler votre demande !**
`;
const standaloneQuestionTemplate = `
Étant donné un historique de conversation (s'il y en a un) et une question,
convertissez la question en une question autonome.
historique de conversation : {conv_history}
question : {question}
question autonome :`;


export const TempBasic = PromptTemplate.fromTemplate(modeleReponseTemplateBasic);
export const TempAI = PromptTemplate.fromTemplate(modeleReponseTemplateOpenAi);
export const standaloneQuestionPrompt = PromptTemplate.fromTemplate(questionAutonomeTemplate);
