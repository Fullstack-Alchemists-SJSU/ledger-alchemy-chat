FROM node:20
RUN mkdir /home/chat-microservice
ENV DATABASE_NAME=ledger_alchemy_user
# ENV DATABASE_USER=master_admin
# ENV DATABASE_PASSWORD=master_password_2023
# ENV DATABASE_HOST=ledger-alchemy-db.ckkydgvcftfv.us-east-1.rds.amazonaws.com
ENV DATABASE_USER=root
ENV DATABASE_PASSWORD=root@123
ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=3306
ENV OPENAI_API_KEY=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
COPY . /home/chat-microservice
WORKDIR /home/chat-microservice
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]