from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import sqlite3
from markupsafe import escape
import json
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import PromptTemplate
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import AzureChatOpenAI
import uuid
import os 
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from datetime import datetime
import json
import re
import base64
app = Flask(__name__)
from langchain import HuggingFaceHub
from huggingface_hub import InferenceApi

os.environ["HUGGINGFACEHUB_API_TOKEN"]='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'
# Enable CORS for all routes and methods
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



def generate_response(query):
    llm_huggingface = InferenceApi(repo_id="google/flan-t5-large", token="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")
    
    # Define the prompt with more context
    prompt = f"Answer the following question in 4-5 lines: {query}"
    
    # Define the parameters for the model
    params = {
        "max_length": 200,  # Increase max_length to allow longer responses
        "temperature": 0  # Adjust temperature for more diverse output
    }
    

    # Generate the response
    output = llm_huggingface(prompt, params=params)
    
    # Extract the generated text
    if output and isinstance(output, list) and len(output) > 0 and 'generated_text' in output[0]:
        generated_text = output[0]['generated_text']
    else:
        generated_text = "No response generated."
    
    # Print and return the output
    print("The output is-------------", generated_text)
    return generated_text

    

def generate_prompt_Output():
    template = "Tell me a joke about {topic}."
    prompt_template = ChatPromptTemplate.from_template(template)

    print("-----Prompt from Template-----")
    prompt = prompt_template.invoke({"topic": "cats"})
    print(prompt)
    return prompt


@app.route('/hello', methods=['POST'])
@cross_origin()
def handle_query():
    data = request.get_json()
    print("The data from frontend", data)
    query = data.get('query')
    AI_output = generate_response(query)
    return jsonify({'response': AI_output})

def store_conversation(username, response):
    conn = sqlite3.connect('mydb.db')
    randid = str(uuid.uuid4())
    c = conn.cursor()
    print("the type is", type(response))
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    c.execute('''
        INSERT INTO chats (id, username, response, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (randid, username, response, timestamp))
    conn.commit()
    conn.close()


def extract_emails_list(response_string):
    # Use a regular expression to find the JSON-like part of the response string
    json_match = re.search(r'```python\s*(.*?)\s*```', response_string, re.DOTALL)
    print("The respone string",response_string,"The json response",json_match)
    if json_match:
        # Extract the JSON-like string
        json_string = json_match.group(1)
        
        # Parse the JSON-like string into a Python list
        emails = json.loads(json_string)
        
        return emails
    else:
        raise ValueError("No JSON-like data found in the response string")


@app.route('/getEmailData', methods=['POST'])
@cross_origin()
def get_email_data():
    data = request.get_json()
    print("The data from frontend", data)
    query = data.get('query')
    AI_output = generate_response(query)
    # getResponse=extract_emails_list(AI_output)
    # print("The emailsList is",getResponse)
    return jsonify({'response': AI_output})


def update_conversation(new_conversations):
    print("The new conversation is", new_conversations)
    json_file_path = 'ConversationHistory.json'

    # Load existing data from the JSON file
    with open(json_file_path, 'r') as file:
        conversation_list = json.load(file)

    # Determine the next available chatName
    existing_chat_names = [chat['chatName'] for chat in conversation_list]
    max_chat_number = max([int(name.split('conversation')[1]) for name in existing_chat_names], default=0)
    next_chat_number = max_chat_number + 1
    next_chat_name = f"conversation{next_chat_number}"

    # Create a new chat entry with the current date and time
    new_chat = {
        "date": datetime.utcnow().isoformat() + 'Z',
        "chatName": next_chat_name,
        "chatHistory": new_conversations
    }

    # Append the new chat entry to the conversation list
    conversation_list.append(new_chat)

    # Write the updated data back to the JSON file
    with open(json_file_path, 'w') as file:
        json.dump(conversation_list, file, indent=4)

    print(f"Conversations have been updated in {json_file_path}")

    return 'File Updated'

@app.route('/newchat', methods=['POST'])
@cross_origin()
def new_chat():
    data = request.get_json()
    # Process the data as needed
    print("Data is", data)
    conversationList = data.get('chat')
    response=update_conversation(conversationList)
    print("The conversationList is",conversationList)
    return jsonify({'message': response})


def generate_historyList():
    json_file_path = 'ConversationHistory.json'
    history_list = []

    # Load existing data from the JSON file
    with open(json_file_path, 'r') as file:
        conversation_history = json.load(file)
    print("The conversation History", conversation_history)
    for chat in conversation_history:
        history_list.append(chat['chatName'])
    print("The historyList", history_list)
    return history_list

@app.route('/getHistory', methods=['GET'])
@cross_origin()
def get_History():
    response = generate_historyList()
    return jsonify({'historyList': response})

@app.route('/chats', methods=['GET'])
@cross_origin()
def get_chats():
    conn = sqlite3.connect('mydb.db')
    c = conn.cursor()
    c.execute('SELECT * FROM chats')
    rows = c.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)

