import boto3
import json
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import AzureChatOpenAI

import os 
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

#rag imports
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

load_dotenv()
git_token=os.environ['GITTOKEN']
# openai_api_key=os.getenv("4o_openai_api_key"),
llm = AzureChatOpenAI(azure_deployment="WM16KModel",
                      model_name="WM16KModel",
                      openai_api_key=os.environ["OPENAI_API_KEY"],
                      openai_api_version="2023-03-15-preview",
                      azure_endpoint="https://wmopenaiinstance.openai.azure.com/")
response=llm.invoke("What is NASA")
print("The response is",response)


#RAG 
# current_dir=os.path.dirname(os.path.abspath(__file__))
# file_path=os.path.join(current_dir,"books",'AntStory.txt')
# new_directory=os.path.join(current_dir,"db","chroma_db")


# if not os.path.exists(new_directory):
#     print("Current Directory does not exist")

#     if not os.path.exists(file_path):
#         raise FileNotFoundError(f"The file doesnot exist")
    
#     loader=TextLoader(file_path)
#     documents=loader.load()

#     text_splitter=CharacterTextSplitter(chunk_size=1000,chunk_overlap=0)
#     docs=text_splitter.split_documents(documents)

#     print("Document Chunks Information")
#     print('Number of document chunks',len(docs))
#     print("Sample Chunks",docs[0].page_content)


#     print("Creating Embeddings")
#     embeddings=OpenAIEmbeddings(model='text-embedding-3-small',openai_api_key=openai_api_key)
#     print("Finished creating embeddings")


#     print("Creating Vector Store")
#     db=Chroma.from_documents(docs,embeddings,persist_directory=current_dir)
#     print("Finished creating vector store")

# else:
#     print("Vector store already exists")


# llm = AzureChatOpenAI(azure_deployment=os.getenv("4o_azure_deployment"),
#                       model_name=os.getenv("4o_model_name"),
#                       openai_api_key=os.getenv("4o_openai_api_key"),
#                       openai_api_version=os.getenv("4o_openai_api_version"),
#                       azure_endpoint=os.getenv("40_azure_endpoint"),
#                       temperature = os.getenv("TEMPERATURE"))

# response=llm.invoke("What is NASA")

# print("The response is",response)





llm.py