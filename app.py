from flask import Flask, render_template, request, jsonify

from utils.summarizer import summarize_text

from config import Config

app = Flask(__name__)
app.config.from_object(Config)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/summarize", methods=["POST"])
def summarize():

    try:

        data = request.get_json()

        text = data.get("text", "").strip()

        # Check for empty input
        if not text:
            return jsonify({
                "success": False,
                "error": "Please enter some text."
            }), 400

        # Check maximum length
        if len(text) > 5000:
            return jsonify({
                "success": False,
                "error": "Maximum 5000 characters allowed."
            }), 400

        # Generate summary
        summary = summarize_text(text)

        return jsonify({
            "success": True,
            "summary": summary
        })

    except ValueError as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    except Exception as e:
        print("Error:", e)

        return jsonify({
            "success": False,
            "error": "Something went wrong while generating the summary."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)