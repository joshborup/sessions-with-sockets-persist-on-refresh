module.exports = {
  get: function(handshake, next, db) {
    var sessionId = handshake.signedCookies["express.sid"];
    if (db) {
      db.query('select * from "session" where sid = $1', sessionId).then(
        session => {
          if (session) {
            handshake.session = session[0];
            console.log(session[0]);
            next();
          } else {
            next();
          }
        }
      );
    }
  }
};
