import { reactive } from 'vue';

const loggedUser = reactive({
    token: undefined,
    email: undefined,
    id: undefined,
    role: undefined,
    school_id: undefined,
    line_id: undefined,
    stop_id: undefined,
    self: undefined
});

function setLoggedUser(data) {
    //console.log('Data passed to setLoggedUser:', data);
    loggedUser.token = data.token;
    loggedUser.email = data.email;
    loggedUser.id = data.id;
    loggedUser.role = data.role;
    loggedUser.school_id = data.school;
    loggedUser.line_id = data.line;
    loggedUser.stop_id = data.stop;
    loggedUser.self = data.self;
    //console.log('setLoggedUser called', loggedUser);
}

function clearLoggedUser() {
    loggedUser.token = undefined;
    loggedUser.email = undefined;
    loggedUser.id = undefined;
    loggedUser.role = undefined;
    loggedUser.school_id = undefined;
    loggedUser.line_id = undefined;
    loggedUser.stop_id = undefined;
    loggedUser.self = undefined;
    console.log('clearLoggedUser called', loggedUser);
}

export { loggedUser, setLoggedUser, clearLoggedUser };
