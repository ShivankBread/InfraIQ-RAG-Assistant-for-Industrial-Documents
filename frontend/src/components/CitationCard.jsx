export default function CitationCard({ source }) {
  return (
    <div className="citation-card">
      <div className="citation-header">
        <span className="citation-source">[Source {source.id}]</span>
        <span className="citation-doc">{source.document}</span>
      </div>
      <p className="citation-preview">"{source.preview}"</p>
      <div className="citation-footer">
        Chunk Index: {source.chunkIndex} • Distance: {source.distance !== undefined ? source.distance.toFixed(4) : "N/A"}
      </div>
    </div>
  );
}

