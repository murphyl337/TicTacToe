/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/27/13
 * Time: 1:26 PM
 * To change this template use File | Settings | File Templates.
 */
function Subject(){
    this.observers = new ObserverList();
}

Subject.prototype.addObserver = function( observer ){
    this.observers.Add( observer );
};

Subject.prototype.removeObserver = function( observer ){
    this.observers.RemoveAt( this.observers.IndexOf( observer, 0 ) );
};

Subject.prototype.notifyObservers = function( context ){
    var observerCount = this.observers.Count();
    for(var i=0; i < observerCount; i++){
        this.observers.Get(i).Update( context );
    }
};
