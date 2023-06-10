module.exports = {
  
  collectCoverage: true,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|sass)$":
        "C:/Users/Alaska/Desktop/agile/__mocks__/fileMock.js",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios|react-toastify))",
    "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.js$",
    "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.ts$",
    "/node_modules/(?![@autofiy/autofiyable|@autofiy/property]).+\\.tsx$",
  ],
  collectCoverageFrom: [
    "src/components/*.{js,jsx}",
    "src/pages/*.{js,jsx}",
  ],
  setupFilesAfterEnv: [
    "C:/Users/Alaska/Desktop/agile/my-app/setupTests.js",
  ],
};
