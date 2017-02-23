
import Main from "./namespaces/main/namespace";
import User from "./namespaces/user/namespace";
import TestScenarios from "./namespaces/testScenarios/namespace";
import {Floodway, WebConnector, WebSocketConnector} from "floodway";
import Tracks from "./namespaces/tracks/namespace";
import ScenarioSession from "./namespaces/scenarioSessions/namespace";
import ScenarioSessions from "./namespaces/scenarioSessions/namespace";
import TrackResults from "./namespaces/trackResults/namespace";
import ClientNamespace from "./namespaces/client/namespace";

let flood = new Floodway();

let webConnector = new WebConnector({
    port: 4040
});

flood.registerConnector(webConnector);

flood.registerConnector(new WebSocketConnector({
    port: null,
    server: webConnector.getServer(),
    allowedOrigins: ["*"]
}));

//flood.registerNamespace(new Client());
flood.registerNamespace(new User());
flood.registerNamespace(new ClientNamespace());
flood.registerNamespace(new TrackResults);
flood.registerNamespace(new TestScenarios());
flood.registerNamespace(new Main());
flood.registerNamespace(new ScenarioSessions());
flood.registerNamespace(new Tracks());


module.exports = flood;