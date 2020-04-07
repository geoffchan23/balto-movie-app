from flask import Flask, jsonify, abort, request
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///movies.db"
db = SQLAlchemy(app)
# migrate = Migrate(app, db)

# Need to add process for ingesting CSV data into movies.db
# Manually imported for now

class Movies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ReleaseYear = db.Column(db.Integer, nullable=True)
    Title = db.Column(db.String, nullable=True)
    OriginEthnicity = db.Column(db.String, nullable=True)
    Director = db.Column(db.String, nullable=True)
    Cast = db.Column(db.String, nullable=True)
    Genre = db.Column(db.String, nullable=True)
    WikiPage = db.Column(db.String, nullable=True)
    Plot = db.Column(db.String, nullable=True)

    def __init__(self, ReleaseYear, Title, OriginEthnicity, Director, Cast, Genre, WikiPage, Plot):
        self.ReleaseYear = ReleaseYear
        self.Title = Title
        self.OriginEthnicity = OriginEthnicity
        self.Director = Director
        self.Cast = Cast
        self.Genre = Genre
        self.WikiPage = WikiPage
        self.Plot = Plot

    def serialize(self):
        return {"id": self.id,
                "releaseYear": self.ReleaseYear,
                "title": self.Title,
                "originEthnicity": self.OriginEthnicity,
                "director": self.Director,
                "cast": self.Cast,
                "genre": self.Genre,
                "wikiPage": self.WikiPage,
                "plot": self.Plot}

@app.route('/')
def index():
    return 'Try /movies/<id> to find movies by ID or /movies?title=<title>&releaseYear=<year>'

@app.route('/movies/', methods=['GET'])
def getMovies():
    title = request.args.get('title', None)
    year = request.args.get('releaseYear', None)
    originEthnicity = request.args.get('originEthnicity', None)
    director = request.args.get('director', None)
    cast = request.args.get('cast', None)
    genre = request.args.get('genre', None)
    page = int(request.args.get('page', 0))
    pageSize = int(request.args.get('pageSize', 10))

    query = Movies.query

    if title:
      query = query.filter(Movies.Title.like('%' + title + '%'))

    if year:
      query = query.filter(Movies.ReleaseYear==year)
    
    if originEthnicity:
      query = query.filter(Movies.OriginEthnicity.like('%' + originEthnicity + '%'))

    if director:
      query = query.filter(Movies.Director.like('%' + director + '%'))

    if cast:
      query = query.filter(Movies.Cast.like('%' + cast + '%'))

    if genre:
      query = query.filter(Movies.Genre.like('%' + genre + '%'))

    query = query.limit(pageSize)
    query = query.offset(page*pageSize)
    searchResult = query.all()

    return jsonify({'movies': list(map(lambda movie: movie.serialize(), searchResult))})

@app.route('/movies/<int:id>/')
def getMovie(id):
    return jsonify({'movies': Movies.query.get(id).serialize()})

# Tried a bunch of different methods and couldn't get around the CORS issue
# Below endpoint not used by front-end app
@app.route('/movies/', methods=['POST'])
@cross_origin()
def createMovie():
    data = request.get_json()

    try:
      title = data['title']
      year = data['releaseYear']
      originEthnicity = data['originEthnicity']
      director = data['director']
      cast = data['cast']
      genre = data['genre']
      wikiPage = data['wikiPage']
      plot = data['plot']
    except:
      abort(400)

    if not title or not year or not originEthnicity or not director or not cast or not genre or not wikiPage or not plot:
      abort(400)

    movie = Movies(Title=title, ReleaseYear=year, OriginEthnicity=originEthnicity, Director=director, Cast=cast, Genre=genre, WikiPage=wikiPage, Plot=plot)
    db.session.add(movie)
    db.session.commit()
    return jsonify({ 'msg': 'Movie was added', 'movies': movie.serialize()}), 201

# Tried a bunch of different methods and couldn't get around the CORS issue
# Below endpoint not used by front-end app
@app.route('/movies/<int:id>/', methods=['DELETE'])
def deleteMovie(id):
    db.session.delete(Movies.query.get(id))
    db.session.commit()
    return jsonify({ 'msg': 'Movie was deleted', 'movieId': id}), 201

# Tried a bunch of different methods and couldn't get around the CORS issue
# Below endpoint not used by front-end app
@app.route('/movies/<int:id>/', methods=['PUT'])
def updateMovie(id):
    data = request.get_json()

    try:
      title = data['title']
      year = data['year']
      originEthnicity = data['originEthnicity']
      director = data['director']
      cast = data['cast']
      genre = data['genre']
      wikiPage = data['wikiPage']
      plot = data['plot']
    except:
      abort(400)
    
    movie = Movies.query.get(id)
    movie.Title = title
    movie.ReleaseYear = year
    movie.OriginEthnicity = originEthnicity
    movie.Director = director
    movie.Cast = cast
    movie.Genre = genre
    movie.WikiPage = wikiPage
    movie.Plot = plot

    db.session.commit()
    return jsonify({ 'msg': 'Movie was updated', 'movie': movie.serialize()}), 201




# Tried a bunch of different methods and couldn't get around the CORS issue
# Doing this work around with GET requests just to show functionality works. 
# I wouldn't normally do something like this otherwise :)



@app.route('/createMovie/', methods=['GET'])
def createMovieGet():
    title = request.args.get('title', None)
    year = request.args.get('releaseYear', None)
    originEthnicity = request.args.get('originEthnicity', None)
    director = request.args.get('director', None)
    cast = request.args.get('cast', None)
    genre = request.args.get('genre', None)
    wikiPage = request.args.get('wikiPage', None)
    plot = request.args.get('plot', None)

    movie = Movies(Title=title, ReleaseYear=year, OriginEthnicity=originEthnicity, Director=director, Cast=cast, Genre=genre, WikiPage=wikiPage, Plot=plot)
    db.session.add(movie)
    db.session.commit()
    return jsonify({ 'msg': 'Movie was added', 'movie': movie.serialize()}), 201

@app.route('/deleteMovie/<int:id>/', methods=['GET'])
def deleteMovieGet(id):
    db.session.delete(Movies.query.get(id))
    db.session.commit()
    return jsonify({ 'msg': 'Movie was deleted', 'movieId': id}), 201

@app.route('/updateMovie/<int:id>/', methods=['GET'])
def updateMovieGet(id):
    title = request.args.get('title', None)
    year = request.args.get('releaseYear', None)
    originEthnicity = request.args.get('originEthnicity', None)
    director = request.args.get('director', None)
    cast = request.args.get('cast', None)
    genre = request.args.get('genre', None)
    wikiPage = request.args.get('wikiPage', None)
    plot = request.args.get('plot', None)
    
    movie = Movies.query.get(id)
    movie.Title = title
    movie.ReleaseYear = year
    movie.OriginEthnicity = originEthnicity
    movie.Director = director
    movie.Cast = cast
    movie.Genre = genre
    movie.WikiPage = wikiPage
    movie.Plot = plot

    db.session.commit()
    return jsonify({ 'msg': 'Movie was updated', 'movie': movie.serialize()}), 201